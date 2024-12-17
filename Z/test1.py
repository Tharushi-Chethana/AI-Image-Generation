# Use a pipeline as a high-level helper
from transformers import pipeline

pipe = pipeline("text-generation", model="meta-llama/Llama-2-7b-hf")

# Load model directly
from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-2-7b-hf")
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-7b-hf")
                                         
def transform_text(prompt):
    # Tokenize the input
    print("Tharushi")
    inputs = tokenizer(prompt, return_tensors="pt")
    
    # Generate a response
    outputs = model.generate(inputs["input_ids"], max_length=200, num_return_sequences=1)
    
    # Decode and return the generated text
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# Example usage
if __name__ == "__main__":
    input_text = "Write a poem about a peaceful evening."
    print("Tharushi")
    transformed_text = transform_text(input_text)
    print("Transformed Text:", transformed_text)