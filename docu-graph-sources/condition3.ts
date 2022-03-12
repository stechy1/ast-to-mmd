function nestedCondition() {
  if (a > 1) {
    if (b > 2) {
      foo();
      fooFoo();
    } else {
      bar();
      barBar();
    }
  } else if (c > 3) {
    baz();
  }

  fooBar();
}
