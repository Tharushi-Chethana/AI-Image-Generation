import os
from flask import Flask, request, jsonify
from huggingface_hub import InferenceClient
from PIL import Image
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

app = Flask(__name__)

# Initialize the client with your API key
api_key = "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"
client = InferenceClient(api_key=api_key)

# Function to expand the user input into a detailed version
def expand_user_input(user_input: str):
    messages = [
        {
            "role": "user",
            "content": f"Please provide a detailed paragraph-style description based on this input: {user_input}"
        }
    ]
    completion = client.chat.completions.create(
        model="meta-llama/Llama-3.2-3B-Instruct",
        messages=messages,
        max_tokens=500,
    )
    expanded_text = completion.choices[0].message['content']
    
    # Clean up and remove unnecessary line breaks or added segments
    # Replace multiple spaces or line breaks with a single space
    expanded_text = ' '.join(expanded_text.splitlines()).strip()
    
    return expanded_text


# Function to generate the image
def generate_image(expanded_text):
    # Expand user input (your logic)
    expanded_text = f"Generate an image based on this: {expanded_text}"

    # Generate the image
    image = client.text_to_image(
        prompt=expanded_text,
        model="black-forest-labs/FLUX.1-dev"
    )
    print("Tharushi")
    # Path to the `generated_images` folder inside the `backend` folder
    generated_images_path = os.path.join("backend", "generated_images")
    os.makedirs(generated_images_path, exist_ok=True)  # Ensure the folder exists

    # Save the image
    image_name = f"{str(os.urandom(4).hex())}.png"
    image_path = os.path.join(generated_images_path, image_name)
    image.save(image_path)
    print(image_name)
    return image_path

@app.route("/generate", methods=["POST"])
def generate():
    user_input = request.json.get("userInput")
    if not user_input:
        return jsonify({"error": "No input provided"}), 400
    
    expanded_text = expand_user_input(user_input)
    image_path = generate_image(expanded_text)
    return jsonify({"imagePath": image_path})

if __name__ == "__main__":
    app.run(port=5001)
