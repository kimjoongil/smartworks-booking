import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";

export const metadata = {
  title: "Products",

}

export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Container>
      <ClientOnly>
        <div className="py-10 px-10">{children}</div>
      </ClientOnly>
    </Container>
  );
}

