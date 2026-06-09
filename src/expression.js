const TOKEN_TYPES = {
  NUMBER: "number",
  OPERATOR: "operator",
  LEFT_PAREN: "leftParen",
  RIGHT_PAREN: "rightParen",
};

function tokenize(expression) {
  const tokens = [];
  let index = 0;

  while (index < expression.length) {
    const character = expression[index];

    if (character === " ") {
      index += 1;
      continue;
    }

    if (/[0-9.]/.test(character)) {
      let numberText = character;
      index += 1;

      while (index < expression.length && /[0-9.]/.test(expression[index])) {
        numberText += expression[index];
        index += 1;
      }

      if ((numberText.match(/\./g) || []).length > 1) {
        throw new Error("Invalid calculation");
      }

      const numberValue = Number(numberText);
      if (Number.isNaN(numberValue)) {
        throw new Error("Invalid calculation");
      }

      tokens.push({ type: TOKEN_TYPES.NUMBER, value: numberValue });
      continue;
    }

    if ("+-*/".includes(character)) {
      tokens.push({ type: TOKEN_TYPES.OPERATOR, value: character });
      index += 1;
      continue;
    }

    if (character === "(") {
      tokens.push({ type: TOKEN_TYPES.LEFT_PAREN, value: character });
      index += 1;
      continue;
    }

    if (character === ")") {
      tokens.push({ type: TOKEN_TYPES.RIGHT_PAREN, value: character });
      index += 1;
      continue;
    }

    throw new Error("Invalid calculation");
  }

  return tokens;
}

function parsePrimary(tokens, position) {
  const token = tokens[position];

  if (!token) {
    throw new Error("Invalid calculation");
  }

  if (token.type === TOKEN_TYPES.NUMBER) {
    return { value: token.value, nextPosition: position + 1 };
  }

  if (token.type === TOKEN_TYPES.OPERATOR && token.value === "-") {
    const parsedValue = parsePrimary(tokens, position + 1);
    return { value: -parsedValue.value, nextPosition: parsedValue.nextPosition };
  }

  if (token.type === TOKEN_TYPES.LEFT_PAREN) {
    const parsedGroup = parseExpression(tokens, position + 1);
    const closingToken = tokens[parsedGroup.nextPosition];

    if (!closingToken || closingToken.type !== TOKEN_TYPES.RIGHT_PAREN) {
      throw new Error("Invalid calculation");
    }

    return { value: parsedGroup.value, nextPosition: parsedGroup.nextPosition + 1 };
  }

  throw new Error("Invalid calculation");
}

function parseTerm(tokens, position) {
  let current = parsePrimary(tokens, position);

  while (current.nextPosition < tokens.length) {
    const token = tokens[current.nextPosition];

    if (!token || token.type !== TOKEN_TYPES.OPERATOR || !["*", "/"].includes(token.value)) {
      break;
    }

    const right = parsePrimary(tokens, current.nextPosition + 1);

    if (token.value === "*") {
      current = { value: current.value * right.value, nextPosition: right.nextPosition };
      continue;
    }

    if (right.value === 0) {
      throw new Error("Cannot divide by zero");
    }

    current = { value: current.value / right.value, nextPosition: right.nextPosition };
  }

  return current;
}

function parseExpression(tokens, position = 0) {
  let current = parseTerm(tokens, position);

  while (current.nextPosition < tokens.length) {
    const token = tokens[current.nextPosition];

    if (!token || token.type !== TOKEN_TYPES.OPERATOR || !["+", "-"].includes(token.value)) {
      break;
    }

    const right = parseTerm(tokens, current.nextPosition + 1);
    current = {
      value: token.value === "+" ? current.value + right.value : current.value - right.value,
      nextPosition: right.nextPosition,
    };
  }

  return current;
}

export function evaluateExpression(expression) {
  const trimmedExpression = expression.trim();

  if (!trimmedExpression) {
    throw new Error("Invalid calculation");
  }

  const tokens = tokenize(trimmedExpression);
  const result = parseExpression(tokens);

  if (result.nextPosition !== tokens.length) {
    throw new Error("Invalid calculation");
  }

  if (Number.isInteger(result.value)) {
    return String(result.value);
  }

  return String(Number(result.value.toFixed(10)));
}
