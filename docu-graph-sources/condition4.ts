function nestedCondition2() {
  foo();

  if (a > 1) {
    bar();
    return 1;
  }
  const b = 5;
  if (b > a) {
    baz();
    return 2;
  }

  return 3
}
