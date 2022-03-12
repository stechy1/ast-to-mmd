function fun() {
  foo();
  if (a > 1) {
    throw new Error();
  }

  baz();

}
