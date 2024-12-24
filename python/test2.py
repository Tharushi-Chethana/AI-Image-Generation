# import os
# import uuid
# from flask import Flask, request, jsonify
# from huggingface_hub import InferenceClient
# from PIL import Image
# from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
# import requests
# from io import BytesIO

# app = Flask(__name__)

# client = InferenceClient(model="black-forest-labs/FLUX.1-dev")

# # Load the model and tokenizer for text expansion
# tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-3B-Instruct")
# model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-3B-Instruct")

# # Set padding token
# tokenizer.pad_token = tokenizer.eos_token
# model.config.pad_token_id = tokenizer.pad_token_id

# # Text generation pipeline
# pipe = pipeline(
#     "text-generation",
#     model=model,
#     tokenizer=tokenizer,
#     truncation=True  # Explicitly enable truncation
# )


# # Function to expand user input into a detailed version
# def expand_user_input(user_input: str):
#     prompt = f"Please provide a detailed paragraph-style description based on this input: {user_input}"
#     output = pipe(prompt, max_length=200, truncation=True, pad_token_id=tokenizer.pad_token_id)
#     expanded_text = output[0]['generated_text'].strip()
#     print(expand_user_input)
#     return expanded_text

# # Function to generate the image
# def generate_image(expanded_text):
#     # Create a text-to-image prompt
#     prompt = f"Generate an image based on this description: {expanded_text}"

#     # Call the online model to generate an image
#     try:
#         image = client.text_to_image(prompt)  # Assumes this returns a PIL Image object
#     except Exception as e:
#         raise Exception(f"Image generation failed: {str(e)}")

#     # Define the path to save images
#     generated_images_path = os.path.join(os.getcwd(), "backend", "generated_images")
#     os.makedirs(generated_images_path, exist_ok=True)

#     # Generate a unique image name
#     image_name = f"{uuid.uuid4().hex}.png"
#     image_path = os.path.join(generated_images_path, image_name)

#     # Save the image
#     image.save(image_path)

#     return image_path


# # def generate_image(expanded_text):
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

# if __name__ == "__main__":
#     app.run(port=5001)

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


# Function to expand user input into a detailed version
def expand_user_input(user_input: str):
    prompt = f"Please provide a detailed paragraph-style description based on this input: {user_input}"
    output = pipe(prompt, max_length=200, truncation=True, pad_token_id=tokenizer.pad_token_id)
    expanded_text = output[0]['generated_text'].strip()
    print(expand_user_input)
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
@app.route("/generate", methods=["POST"])
def generate():
    user_input = request.json.get("userInput")
    if not user_input:
        return jsonify({"error": "No input provided"}), 400
    
    expanded_text = expand_user_input(user_input)
    print(expanded_text)
    image_path = generate_image(expanded_text)
    return jsonify({
        "imagePath": image_path,
        "expandedText": expanded_text 
    })

if __name__ == "__main__":
    app.run(port=5001)