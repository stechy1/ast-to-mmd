function fun() {

  foo();

  for (let i = 0; i <10; i++) {
    if (i == 5) {
      fooBar();
    } else {
      fooBaz();
      throw new Error();
    }
    bar();
  }

  baz();

}
