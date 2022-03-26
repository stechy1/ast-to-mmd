function fun() {
  foo();
  const variable: number = 10;

  switch (variable) {
    case 1:
      bar();
      break;
    case 2:
    case 3:
    default:
      fooBaz();
      break;
  }

  lastFunction();

}
