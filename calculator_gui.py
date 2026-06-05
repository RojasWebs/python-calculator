import tkinter as tk

def get_inputs():
    try:
        a = float(first_number_entry.get())
        b = float(second_number_entry.get())
        return a, b
    except ValueError:
        result_label.config(text="Please enter valid numbers.")
        return None, None

def add():
    a, b = get_inputs()
    if a is None:
        return
    result_label.config(text=f"Result: {a + b}")

def subtract():
    a, b = get_inputs()
    if a is None:
        return
    result_label.config(text=f"Result: {a - b}")

def multiply():
    a, b = get_inputs()
    if a is None:
        return
    result_label.config(text=f"Result: {a * b}")

def divide():
    a, b = get_inputs()
    if a is None:
        return
    if b == 0:
        result_label.config(text="Error: Division by zero is not allowed.")
        return
    result_label.config(text=f"Result: {a / b}")

def clear():
    first_number_entry.delete(0, tk.END)
    second_number_entry.delete(0, tk.END)
    result_label.config(text="Result")

def show_shortcuts():
    # prevent multiple windows
    if getattr(window, 'shortcuts_win', None) and tk.Toplevel.winfo_exists(window.shortcuts_win):
        window.shortcuts_win.lift()
        return

    win = tk.Toplevel(window)
    window.shortcuts_win = win
    win.title("Keyboard Shortcuts")
    win.resizable(False, False)
    win.transient(window)
    shortcuts_text = (
        "Enter / KP Enter: Add\n"
        "Ctrl+A: Add\n"
        "Ctrl+S: Subtract\n"
        "Ctrl+M: Multiply\n"
        "Ctrl+D: Divide\n"
        "Ctrl+L: Clear"
    )
    lbl = tk.Label(win, text=shortcuts_text, justify='left', padx=12, pady=8)
    lbl.pack()
    btn = tk.Button(win, text="Close", command=lambda: (win.destroy(), setattr(window, 'shortcuts_win', None)))
    btn.pack(pady=(0,8))

window = tk.Tk()
window.attributes('-topmost', True)
window.title("Simple Calculator")
window.geometry("300x330")

title_label = tk.Label(window, text="Simple Calculator", font=("Arial", 20))
title_label.pack(pady=12)

# Shortcuts button (opens popup)
shortcuts_button = tk.Button(window, text="Shortcuts", font=("Arial", 9), command=show_shortcuts)
shortcuts_button.pack(pady=4)

first_number_entry = tk.Entry(window, font=("Arial", 16))
first_number_entry.pack(pady=6)

second_number_entry = tk.Entry(window, font=("Arial", 16))
second_number_entry.pack(pady=6)

add_button = tk.Button(window, text="Add", command=add)

# Arrange buttons in a grid inside a frame for a cleaner layout
button_frame = tk.Frame(window)
button_frame.pack(pady=6)

add_button = tk.Button(button_frame, text="Add", command=add)
add_button.grid(row=0, column=0, padx=6, pady=4)

subtract_button = tk.Button(button_frame, text="Subtract", command=subtract)
subtract_button.grid(row=0, column=1, padx=6, pady=4)

multiply_button = tk.Button(button_frame, text="Multiply", command=multiply)
multiply_button.grid(row=1, column=0, padx=6, pady=4)

divide_button = tk.Button(button_frame, text="Divide", command=divide)
divide_button.grid(row=1, column=1, padx=6, pady=4)

clear_button = tk.Button(button_frame, text="Clear", command=clear)
clear_button.grid(row=2, column=0, columnspan=2, pady=6)

result_label = tk.Label(window, text="Result", font=("Arial", 16))
result_label.pack(pady=12)

# Keyboard shortcuts (non-intrusive):
# - Enter / keypad Enter -> Add
# - Ctrl+A -> Add, Ctrl+S -> Subtract, Ctrl+M -> Multiply, Ctrl+D -> Divide
# - Ctrl+L -> Clear
window.bind('<Return>', lambda e: add())
window.bind('<KP_Enter>', lambda e: add())
window.bind('<Control-a>', lambda e: add())
window.bind('<Control-s>', lambda e: subtract())
window.bind('<Control-m>', lambda e: multiply())
window.bind('<Control-d>', lambda e: divide())
window.bind('<Control-l>', lambda e: clear())

window.mainloop()