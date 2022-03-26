function fun() {
  foo();
  const variable: number = 10;

  switch (variable) {
    case 2:
    case 3:
      baz();
      fooBar();
      return;
  }

  lastFunction();

}
