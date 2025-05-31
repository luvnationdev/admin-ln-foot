// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { type QueryClient } from "@tanstack/react-query";
import { CategoryControllerService, HeadingControllerService, OrderControllerService, ProductControllerService, ProductVariantControllerService, PromotionProductControllerService, ReviewControllerService, SizeControllerService } from "../requests/services.gen";
import * as Common from "./common";
export const prefetchUseSizeControllerServiceGetApiSizesById = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseSizeControllerServiceGetApiSizesByIdKeyFn({ id }), queryFn: () => SizeControllerService.getApiSizesById({ id }) });
export const prefetchUseSizeControllerServiceGetApiSizes = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseSizeControllerServiceGetApiSizesKeyFn(), queryFn: () => SizeControllerService.getApiSizes() });
export const prefetchUseReviewControllerServiceGetApiReviewsById = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseReviewControllerServiceGetApiReviewsByIdKeyFn({ id }), queryFn: () => ReviewControllerService.getApiReviewsById({ id }) });
export const prefetchUseReviewControllerServiceGetApiReviews = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseReviewControllerServiceGetApiReviewsKeyFn(), queryFn: () => ReviewControllerService.getApiReviews() });
export const prefetchUsePromotionProductControllerServiceGetApiPromotionProductsById = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UsePromotionProductControllerServiceGetApiPromotionProductsByIdKeyFn({ id }), queryFn: () => PromotionProductControllerService.getApiPromotionProductsById({ id }) });
export const prefetchUsePromotionProductControllerServiceGetApiPromotionProducts = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UsePromotionProductControllerServiceGetApiPromotionProductsKeyFn(), queryFn: () => PromotionProductControllerService.getApiPromotionProducts() });
export const prefetchUseProductControllerServiceGetApiProductsById = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseProductControllerServiceGetApiProductsByIdKeyFn({ id }), queryFn: () => ProductControllerService.getApiProductsById({ id }) });
export const prefetchUseProductControllerServiceGetApiProducts = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseProductControllerServiceGetApiProductsKeyFn(), queryFn: () => ProductControllerService.getApiProducts() });
export const prefetchUseProductVariantControllerServiceGetApiProductVariantsById = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseProductVariantControllerServiceGetApiProductVariantsByIdKeyFn({ id }), queryFn: () => ProductVariantControllerService.getApiProductVariantsById({ id }) });
export const prefetchUseProductVariantControllerServiceGetApiProductVariants = (queryClient: QueryClient, { productId }: {
  productId?: string;
} = {}) => queryClient.prefetchQuery({ queryKey: Common.UseProductVariantControllerServiceGetApiProductVariantsKeyFn({ productId }), queryFn: () => ProductVariantControllerService.getApiProductVariants({ productId }) });
export const prefetchUseOrderControllerServiceGetApiOrdersById = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseOrderControllerServiceGetApiOrdersByIdKeyFn({ id }), queryFn: () => OrderControllerService.getApiOrdersById({ id }) });
export const prefetchUseOrderControllerServiceGetApiOrders = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseOrderControllerServiceGetApiOrdersKeyFn(), queryFn: () => OrderControllerService.getApiOrders() });
export const prefetchUseOrderControllerServiceGetApiOrdersUserOrders = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseOrderControllerServiceGetApiOrdersUserOrdersKeyFn(), queryFn: () => OrderControllerService.getApiOrdersUserOrders() });
export const prefetchUseCategoryControllerServiceGetApiCategoriesById = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseCategoryControllerServiceGetApiCategoriesByIdKeyFn({ id }), queryFn: () => CategoryControllerService.getApiCategoriesById({ id }) });
export const prefetchUseCategoryControllerServiceGetApiCategories = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseCategoryControllerServiceGetApiCategoriesKeyFn(), queryFn: () => CategoryControllerService.getApiCategories() });
export const prefetchUseHeadingControllerServiceGetApiHeadings = (queryClient: QueryClient) => queryClient.prefetchQuery({ queryKey: Common.UseHeadingControllerServiceGetApiHeadingsKeyFn(), queryFn: () => HeadingControllerService.getApiHeadings() });
export const prefetchUseHeadingControllerServiceGetApiHeadingsById = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.prefetchQuery({ queryKey: Common.UseHeadingControllerServiceGetApiHeadingsByIdKeyFn({ id }), queryFn: () => HeadingControllerService.getApiHeadingsById({ id }) });
