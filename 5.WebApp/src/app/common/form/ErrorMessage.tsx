import React, { Fragment } from "react";
import { AxiosResponse } from "axios";
import { Message } from "semantic-ui-react";

interface IProps {
  error: AxiosResponse;
  text?: string;
}

const ErrorMessage: React.FC<IProps> = ({ error, text }) => {
  return (
    <Message error>
      <Message.Header>{error.statusText}</Message.Header>
      {error.data && Object.keys(error.data.errors).length > 0 && (
        <Fragment>
          {Object.values(error.data.errors)
            .flat()
            .map((err, i) => (
              <p key={i}>{err}</p>
            ))}
        </Fragment>
      )}
      {text && <p>{text}</p>}
    </Message>
  );
};

export default ErrorMessage;
