import os
import uuid
from flask import Flask, request, jsonify
from huggingface_hub import InferenceClient
from PIL import Image
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import requests
from io import BytesIO

app = Flask(__name__)

client = InferenceClient(model="black-forest-labs/FLUX.1-dev")

# Load the model and tokenizer for text expansion
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-3B-Instruct")
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-3B-Instruct")

# Set padding token
tokenizer.pad_token = tokenizer.eos_token
model.config.pad_token_id = tokenizer.pad_token_id

# Text generation pipeline
pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    truncation=True  # Explicitly enable truncation
)

@app.route("/expand", methods=["POST"])
def expand():
    user_input = request.json.get("userInput")
    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    expanded_text = expand_user_input(user_input)
    print(expanded_text)
    return jsonify(expanded_text)

@app.route("/generate-image", methods=["POST"])
def generate_image_route():
    print("Gunathilaka")
    expanded_text = request.json.get("expandedText")
    if not expanded_text:
        return jsonify({"error": "No expanded text provided"}), 400

    image_path = generate_image(expanded_text)
    return jsonify(image_path)


# Function to expand user input into a detailed version
def expand_user_input(user_input: str):
    # Prepare the prompt
    prompt = f"Please provide a detailed paragraph-style description based on this input: {user_input}"
    
    # Generate text using the pipeline
    output = pipe(prompt, max_length=2500, truncation=True, pad_token_id=tokenizer.pad_token_id)
    expanded_text = output[0]['generated_text'].strip()
    
    # Remove the prompt prefix from the text
    prefix = "Please provide a detailed paragraph-style description based on this input: "
    start_index = expanded_text.find(prefix)
    if start_index != -1:
        # Extract everything after the prefix
        expanded_text = expanded_text[start_index + len(prefix):].strip()
    
    print(expanded_text)
    return expanded_text


# Function to generate the image
def generate_image(expanded_text):
    # Create a text-to-image prompt
    prompt = f"Generate an image based on this description: {expanded_text}"

    # Call the online model to generate an image
    try:
        image = client.text_to_image(prompt)  # Assumes this returns a PIL Image object
    except Exception as e:
        raise Exception(f"Image generation failed: {str(e)}")

    # Define the path to save images
    generated_images_path = os.path.join(os.getcwd(), "backend", "generated_images")
    os.makedirs(generated_images_path, exist_ok=True)

    # Generate a unique image name
    image_name = f"{uuid.uuid4().hex}.png"
    image_path = os.path.join(generated_images_path, image_name)

    # Save the image
    image.save(image_path)

    return image_path


# def generate_image(expanded_text):
# @app.route("/generate", methods=["POST"])
# def generate():
#     user_input = request.json.get("userInput")
#     if not user_input:
#         return jsonify({"error": "No input provided"}), 400
    
#     expanded_text = expand_user_input(user_input)
#     print(expanded_text)
#     image_path = generate_image(expanded_text)
#     return jsonify({
#         "imagePath": image_path,
#         "expandedText": expanded_text 
#     })

if __name__ == "__main__":
    app.run(port=5001)