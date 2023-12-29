import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";
import GuideClient from "./GuideClient";

const GuidePage = async () => {
  
  return (
    <Container>
      <ClientOnly>
        <GuideClient />
      </ClientOnly>
    </Container>
  );
};

export default GuidePage;
