function fun() {
  foo();
  if (a > 1) {
    bar();
  } else {
    throw new Error();
  }

  baz();

}
