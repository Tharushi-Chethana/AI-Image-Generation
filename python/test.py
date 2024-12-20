import os
import uuid
from flask import Flask, request, jsonify
from huggingface_hub import InferenceClient
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from PIL import Image

app = Flask(__name__)

# Initialize the InferenceClient
client = InferenceClient(model="black-forest-labs/FLUX.1-dev")

# Load the model and tokenizer once at startup
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-3B-Instruct")
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-3B-Instruct")

# Set padding token
tokenizer.pad_token = tokenizer.eos_token
model.config.pad_token_id = tokenizer.pad_token_id

# Initialize the text generation pipeline
pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    truncation=True,
    device=0  # Use GPU (if available)
)


def expand_user_input(user_input: str):
    """Expand user input into a detailed description."""
    prompt = f"Provide a detailed description based on: {user_input}"
    output = pipe(prompt, max_length=60, truncation=True, pad_token_id=tokenizer.pad_token_id)
    expanded_text = output[0]['generated_text'].strip()
    return expanded_text


def generate_image(expanded_text):
    """Generate an image based on the expanded text."""
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


@app.route("/generate", methods=["POST"])
def generate():
    """API endpoint to generate an image from user input."""
    user_input = request.json.get("userInput")
    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    # Expand the input
    expanded_text = expand_user_input(user_input)

    # Generate the image
    image_path = generate_image(expanded_text)

    return jsonify({"imagePath": image_path})


if __name__ == "__main__":
    app.run(port=5001)
