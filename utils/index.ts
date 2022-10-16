export const getProviderIcon = (name: string) => {
  switch(name) {
    case "Google":
      return "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg";
  }
}

export const generateUserTag = (name: string) => {
  let generatedTag = `${name.split(" ")[0]}#`;

  for (let i = 0; i < 4; ++i) {
    const random = Math.floor(Math.random() * 10)
    generatedTag += random;
  }

  return generatedTag;
}