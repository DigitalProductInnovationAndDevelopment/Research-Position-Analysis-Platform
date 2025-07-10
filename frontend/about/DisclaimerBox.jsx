import { Card, CardHeader, CardTitle, CardContent } from "../src/components/ui/card";

const DisclaimerBox = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Disclaimer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          SPARK is intended for internal research teams and does not guarantee exhaustive coverage of every publication source. External data changes or API updates may affect result completeness. Use SPARK insights as a guide, not a definitive source of record.
        </p>
        <p>
          This website is part of a non-commercial academic project and uses only publicly available, open-source data. No commercial intent is pursued.
        </p>
      </CardContent>
    </Card>
  );
};

export default DisclaimerBox; 