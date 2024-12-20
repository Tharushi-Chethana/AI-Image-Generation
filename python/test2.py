import os
import uuid
from flask import Flask, request, jsonify
from huggingface_hub import InferenceClient
from PIL import Image
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import requests
from io import BytesIO


app = Flask(__name__)

# Load the model and tokenizer for text expansion
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-1B-Instruct")
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-1B-Instruct")

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
    output = pipe(prompt, max_length=100, truncation=True, pad_token_id=tokenizer.pad_token_id)
    expanded_text = output[0]['generated_text'].strip()
    print(expand_user_input)
    return expanded_text


def handle_user_input():
    user_input = input("Please type your text: ")  # User types the input here
    expanded_text = expand_user_input(user_input)  # Send input to the model for expansion
    print("Expanded Text: ", expanded_text)  # Display the detailed response

# Run the process
handle_user_input()