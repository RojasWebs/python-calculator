import tkinter as tk
import ast
import operator

OPERATIONS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.USub: operator.neg,
}


def solve(node):
    if isinstance(node, ast.Expression):
        return solve(node.body)

    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return node.value

    if isinstance(node, ast.BinOp) and type(node.op) in OPERATIONS:
        return OPERATIONS[type(node.op)](solve(node.left), solve(node.right))

    if isinstance(node, ast.UnaryOp) and type(node.op) in OPERATIONS:
        return OPERATIONS[type(node.op)](solve(node.operand))

    raise ValueError


def add_to_display(value):
    display.insert(tk.END, value)
    display.focus()


def calculate(event=None):
    try:
        expression = display.get()
        result = solve(ast.parse(expression, mode="eval"))

        if isinstance(result, float) and result.is_integer():
            result = int(result)

        display.delete(0, tk.END)
        display.insert(0, result)
    except ZeroDivisionError:
        show_error("Cannot divide by zero")
    except (SyntaxError, ValueError, TypeError):
        show_error("Invalid calculation")


def show_error(message):
    display.delete(0, tk.END)
    display.insert(0, message)


def clear(event=None):
    display.delete(0, tk.END)
    display.focus()


def backspace():
    current_text = display.get()
    display.delete(0, tk.END)
    display.insert(0, current_text[:-1])


window = tk.Tk()
window.attributes("-topmost", True)
window.title("Simple Calculator")
window.geometry("330x420")
window.resizable(False, False)
window.configure(bg="#263238")

title_label = tk.Label(
    window,
    text="Simple Calculator",
    font=("Arial", 20, "bold"),
    bg="#263238",
    fg="white",
)
title_label.pack(pady=(18, 12))

display = tk.Entry(
    window,
    font=("Arial", 22),
    justify="right",
    bg="#d8f3dc",
    fg="#102a13",
    insertbackground="#102a13",
    relief="flat",
    bd=8,
)
display.pack(fill="x", padx=18, pady=(0, 14), ipady=10)
display.focus()

button_frame = tk.Frame(window, bg="#263238")
button_frame.pack(padx=14)

buttons = [
    ("7", "7"), ("8", "8"), ("9", "9"), ("÷", "/"),
    ("4", "4"), ("5", "5"), ("6", "6"), ("×", "*"),
    ("1", "1"), ("2", "2"), ("3", "3"), ("−", "-"),
    ("0", "0"), (".", "."), ("=", "="), ("+", "+"),
]

for index, (label, value) in enumerate(buttons):
    row = index // 4
    column = index % 4

    if value == "=":
        command = calculate
        color = "#ffb703"
    else:
        command = lambda item=value: add_to_display(item)
        color = "#546e7a" if value in "+-*/" else "#455a64"

    button = tk.Button(
        button_frame,
        text=label,
        command=command,
        font=("Arial", 16, "bold"),
        width=4,
        height=2,
        bg=color,
        fg="#263238",
        activebackground="#263238",
        activeforeground="#263238",
        relief="flat",
    )
    button.grid(row=row, column=column, padx=4, pady=4)

clear_button = tk.Button(
    button_frame,
    text="Clear",
    command=clear,
    font=("Arial", 14, "bold"),
    bg="#d1495b",
    fg="#263238",
    activebackground="#9d2f3f",
    activeforeground="#263238",
    relief="flat",
)
clear_button.grid(row=4, column=0, columnspan=3, sticky="ew", padx=4, pady=4)

backspace_button = tk.Button(
    button_frame,
    text="⌫",
    command=backspace,
    font=("Arial", 16, "bold"),
    bg="#607d8b",
    fg="#263238",
    activebackground="#263238",
    activeforeground="#263238",
    relief="flat",
)
backspace_button.grid(row=4, column=3, sticky="ew", padx=4, pady=4)

window.bind("<Return>", calculate)
window.bind("<KP_Enter>", calculate)
window.bind("<Escape>", clear)

window.mainloop()
