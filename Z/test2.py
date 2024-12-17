# from huggingface_hub import InferenceClient

# # Initialize the client with your API key
# client = InferenceClient(api_key="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")

# # Your input message (the short text you want to expand)
# messages = [
#     {
#         "role": "user",
#         "content": "A short paragraph about Kandy in Srilanka"
#     }
# ]

# # Request the model to expand the text into a more detailed version
# completion = client.chat.completions.create(
#     model="meta-llama/Llama-3.2-1B-Instruct",  # Model for instruction-based tasks
#     messages=messages,
#     max_tokens=1000  # Adjust this value to control the length of the response
# )

# # Print the detailed response (expanded text)
# print(completion.choices[0].message['content'])

from huggingface_hub import InferenceClient

# Initialize the client with your API key
client = InferenceClient(api_key="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")

# Function to expand the user input into a detailed version
def expand_user_input(user_input: str):
    # Prepare the message for the model
    messages = [
        {
            "role": "user",
            "content": f"Please provide a detailed paragraph-style description based on this input: {user_input}"  # Requesting a paragraph description
        }
    ]
    
    # Request the model to expand the text into a more detailed version
    completion = client.chat.completions.create(
        model="meta-llama/Llama-3.2-3B-Instruct", 
        messages=messages, 
        max_tokens=500
    )
    
    # Return the expanded version of the text
    return completion.choices[0].message['content']

# Example of how this could work in your project flow
def handle_user_input():
    user_input = input("Please type your text: ")  # User types the input here
    expanded_text = expand_user_input(user_input)  # Send input to the model for expansion
    print("Expanded Text: ", expanded_text)  # Display the detailed response

# Run the process
handle_user_input()
