import tkinter as tk

def add():
    first_number = float(first_number_entry.get())
    second_number = float(second_number_entry.get())
    result = first_number + second_number
    result_label.config(text=f"Result: {result}")

window = tk.Tk()
window.attributes('-topmost', True)
window.title("Simple Calculator")
window.geometry("300x330")

title_label = tk.Label(window, text="Simple Calculator", font=("Arial", 20))
title_label.pack(pady=12)

first_number_entry = tk.Entry(window, font=("Arial", 16))
first_number_entry.pack(pady=6)

second_number_entry = tk.Entry(window, font=("Arial", 16))
second_number_entry.pack(pady=6)

add_button = tk.Button(window, text="Add", command=add)
add_button.pack(pady=4)

result_label = tk.Label(window, text="Result", font=("Arial", 16))
result_label.pack(pady=12)

window.mainloop()