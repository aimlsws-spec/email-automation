// Local Imports
import { Card } from "components/ui";
import { mailList } from "../data";
import { Item } from "./Item";
import { Header } from "./Header";
import { Footer } from "./Footer";

// ----------------------------------------------------------------------

export function MailList() {
  return (
    <>
      <Header />
      <Card>
        {mailList.map((mail) => (
          <Item key={mail.id} data={mail} />
        ))}
      </Card>
      <Footer />
    </>
  );
}
