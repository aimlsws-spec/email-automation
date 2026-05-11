// Local Imports
import { Content } from "./Content";
import { Header } from "./Header";
import { Reply } from "./Reply";
import { Sender } from "./Sender";
import { Title } from "./Title";

// ----------------------------------------------------------------------

export default function MailContent() {
  return (
    <div className="flex min-h-[calc(100dvh-85px)] flex-col">
      <div className="grow">
        <Header />
        <Title />
        <Sender />
        <Content />
      </div>
      <Reply />
    </div>
  );
}
