function function1() {
  const a = 1;
  const b = 2;
  const c = a + b;
  console.log(c);
  function2();

  const c1 = new Class1();

  c1.Class1Function1();
}

export function function2() {
  console.log('Hello world');
  const d = 1;
  if (d > 5) {
    function1();
    function2();
  } else {
    function2();
    function1();
  }
  function3();
}

function function3() {
  function1();
}

export class Class1 {
  public Class1Function1() {
    console.log('Hello class world');
  }
}
