function nestedCondition() {
  if (a > 1) {
    if (b > 2) {
      foo();
    } else {
      bar();
    }
  } else if (c > 3) {
    baz();
  }

  fooBar();
}
