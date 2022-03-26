function fun() {
  foo();
  const variable: number = 10;

  switch (variable) {
    case 1:
      bar();
      break;
    default:
      fooBaz();
      break;
  }

  lastFunction();

}
