function fun() {

  foo();
  const array = ['a', 'b', 'c'];

  for (const element in array) {
    bar(element);
  }

  baz();
}
