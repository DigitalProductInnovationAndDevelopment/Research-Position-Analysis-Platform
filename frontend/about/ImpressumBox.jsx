import { Card, CardHeader, CardTitle, CardContent } from "../src/components/ui/card";

const ImpressumBox = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Impressum</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Information in accordance with Section 5 TMG<br />
          (Telemediengesetz):<br />
          Jane Doe<br />
          c/o Technical University of Munich<br />
          Munich, Germany<br />
          Contact:<br />
          E-mail: jane.doe@example.com<br />
          Responsible for content according to Section 55 (2) <br />
          RStV (Rundfunkstaatsvertrag):<br />
          Jane Doe<br />
          (Address as above). No cookies are set.
        </p>
      </CardContent>
    </Card>
  );
};

export default ImpressumBox; 