import os
import time
import PyPDF2
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

# Load the model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-3B-Instruct")
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-3B-Instruct")

# Define pad_token_id and eos_token_id
tokenizer.pad_token = tokenizer.eos_token  # Set padding token to be the same as end of sequence
model.config.pad_token_id = tokenizer.pad_token_id  # Update model config with pad token id

pipe = pipeline("text-generation", model=model, tokenizer=tokenizer)

# Function to extract text from a PDF file
def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text

# Function to ask questions and get answers using the model
def ask_question(text, question):
    input_text = f"{text}\n\nQuestion: {question}\nAnswer:"
    response = pipe(input_text, max_new_tokens=50, num_return_sequences=1)
    generated_text = response[0]['generated_text']

    # Extract the answer more reliably by using string slicing
    answer_part = generated_text.split("Answer:")[-1].strip()  # Only keep what's after "Answer:"
    return answer_part.split("\n")[0]  # Return only the first line after "Answer:"

# Handle the folder and extract data from PDF files
def process_pdfs(folder_path):
    # List all PDF files in the specified directory
    pdf_files = [f for f in os.listdir(folder_path) if f.endswith('.pdf')]

    # Check if there are no PDF files found
    if not pdf_files:
        print("No PDF files found in the specified folder.")
        return

    # Loop through each PDF file
    for pdf_file in pdf_files:
        pdf_path = os.path.join(folder_path, pdf_file)
        print(f"Processing {pdf_file}...")

        text = extract_text_from_pdf(pdf_path)

        # List of questions
        questions = [
            "Extract only the Invoice No?",
            "Extract only the Invoice Date?",
            "Extract only the vendor of the Invoice?",
            "Extract only the total amount due?",
            "Extract only the Currency in the Invoice?",
            #"Extract only the PO Number?",
            #"Extract only the PO Date?",
            #"Extract only the Vendor?",
            #"Extract only the Vendor Number?",

        ]

        # Loop through each question and get the answer
        for question in questions:
            answer = ask_question(text, question)
            print(f"{question}: {answer}")
        print()  # Print a newline for better separation between invoices

# Main loop to scan the folder every 60 seconds
def main(folder_path):
    while True:
        process_pdfs(folder_path)
        time.sleep(60)  

# Example usage
if __name__ == "__main__":
    folder_path = "C:/Users/Redline PC/Documents/Invoices"  # Folder path
    main(folder_path)
