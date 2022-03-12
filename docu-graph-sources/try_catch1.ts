function fun() {
  foo();
  try {
    dangerousFunctions();
  } catch (e) {
    catchExceptions();
  } finally {
    executeFinally();
  }
  bar();
}
