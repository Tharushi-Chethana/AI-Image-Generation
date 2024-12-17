import os
from huggingface_hub import InferenceClient
from PIL import Image

# Initialize the client with the same API key for both tasks
api_key = "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"  # Replace with your actual API key
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


# Function to generate an image based on expanded text
def generate_image_from_text(expanded_text, save_path):
    try:
        # Generate image using the text-to-image model (simplify the API call)
        image = client.text_to_image(
            prompt=expanded_text,
            model="black-forest-labs/FLUX.1-dev"  # Replace with your model name
        )
        
        # Ensure the save directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        # Save the PIL.Image object
        image.save(save_path, format="PNG")
        print(f"Image successfully saved at: {save_path}")
    except Exception as e:
        print(f"Error generating or saving the image: {e}")


# Main function
def handle_user_input():
    user_input = input("Please type your text: ")
    expanded_text = expand_user_input(user_input)
    print("Expanded Text:", expanded_text)
    
    # Define folder and file path for the image
    save_folder = "Images"
    save_file_name = "generated_image.png"
    save_path = os.path.join(save_folder, save_file_name)
    
    # Generate and save the image
    generate_image_from_text(expanded_text, save_path)

# Run the script
if __name__ == "__main__":
    handle_user_input()
