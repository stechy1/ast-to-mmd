function fun() {
  foo();
  try {
    dangerousFunctions();
  } catch (e) {
    catchExceptions();
  }
  bar();
}
