import { getProductBySlug } from "@/actions/get-product";
import { getProducts } from "@/actions/get-products";
import { getLocationGroups } from "@/actions/get-location-group";
import { notFound } from "next/navigation"; 
import { Metadata, ResolvingMetadata } from "next";
import { ProductPageContent } from "@/components/store/ProductPageClient";

interface ProductPageProps {
  params: { slug: string };
}

export const revalidate = 600;

export async function generateStaticParams() {
  try {
    const products = await getProducts({ selectFields: ["variants.slug"], limit:"1000" }); 
    if (!products?.products?.length) {
      console.warn("generateStaticParams: No products found");
      return [];
    }
    return products.products
      .filter((product) => product.variants?.length && product.variants[0]?.slug) 
      .map((product) => ({
        slug: product.variants[0].slug,
      }));
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return []; 
  }
}

export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const productData = await getProductBySlug(params.slug);
    if (!productData || !productData.variant) {
      return {
        title: "Product Not Found",
        description: "The requested product is not available.",
      };
    }

    const { variant } = productData;
    const previousImages = (await parent).openGraph?.images || [];

    const title = variant.metaTitle || `Buy ${variant.name}`;
    const description = variant.metaDescription || variant.description;
    const keywords = variant.metaKeywords?.length ? variant.metaKeywords : [];
    const ogImage =
      variant.openGraphImage ||
      variant.images[0]?.url ||
      "/placeholder-image.jpg";

    return {
      title,
      description,
      keywords,
      openGraph: {
        images: [
          {
            url: ogImage,
            height: 1200,
            width: 900,
          },
          ...previousImages,
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [
          {
            url: ogImage,
            height: 1200,
            width: 900,
          },
        ],
      },
      category: "ecommerce",
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    return {
      title: "Product Not Found",
      description: "The requested product is not available.",
    };
  }
}

const ProductPage = async ({ params }: ProductPageProps) => {
  try {
    const [productData, productsData, locationGroups] = await Promise.all([
      getProductBySlug(params.slug),
      getProducts({
        categoryId: "",
        limit: "10",
      }).catch(() => ({ products: [], totalCount: 0 })),
      getLocationGroups().catch(() => []),
    ]);

    if (!productData || !productData.variant || !productData.allVariants?.length) {
      notFound(); 
    }

    const productsDataWithCategory = productData.product?.category?.id
      ? await getProducts({
          categoryId: productData.product.category.id,
          limit: "10",
        }).catch(() => ({ products: [], totalCount: 0 }))
      : { products: [], totalCount: 0 };

    const suggestProducts = productsDataWithCategory.products.filter(
      (item) => item.id !== productData.product.id
    );

    return (
      <ProductPageContent
        productData={productData}
        suggestProducts={suggestProducts}
        locationGroups={locationGroups}
      />
    );
  } catch (error) {
    console.error("Error in ProductPage:", error);
    notFound(); 
  }
};

export default ProductPage;