function fun() {

  foo();

  for (let i = 0; i <10; i++) {
    if (i == 5) {
      continue;
    }
    bar();
  }

  baz();

}
