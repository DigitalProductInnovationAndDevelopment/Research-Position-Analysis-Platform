import { Card, CardHeader, CardTitle, CardContent } from "../src/components/ui/card";

const PrivacyPolicyBox = () => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Privacy Policy</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          This website does not collect or store any personal data. We use only publicly available, open-source information and do not track or analyze visitor behavior. No cookies are set.
        </p>
      </CardContent>
    </Card>
  );
};

export default PrivacyPolicyBox; 