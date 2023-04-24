import React from "react";

type Props = {
  text: string;
};

export default function InformationText({ text }: Props) {
  return <div>Click a {text} to display additional information</div>;
}
