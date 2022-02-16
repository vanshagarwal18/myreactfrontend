import React, { useEffect } from "react";
import Container from "./Container";

function Page(props) {
  //useEffect(a,b)//First arguement a is the function you want to be run
  //Second argument b is the list of dependencies. If any of these
  //dependencies change,then a function is run
  useEffect(() => {
    document.title = `${props.title} | ComplexApp`;
    window.scrollTo(0, 0);
  }, [props.title]); //[] means it will run only first time when page is rendered.

  return <Container wide={props.wide}>{props.children}</Container>;
}

export default Page;
