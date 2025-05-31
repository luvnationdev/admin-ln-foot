// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { type QueryClient } from "@tanstack/react-query";
import { CategoryControllerService, HeadingControllerService, OrderControllerService, ProductControllerService, ProductVariantControllerService, PromotionProductControllerService, ReviewControllerService, SizeControllerService } from "../requests/services.gen";
import * as Common from "./common";
export const ensureUseSizeControllerServiceGetApiSizesByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseSizeControllerServiceGetApiSizesByIdKeyFn({ id }), queryFn: () => SizeControllerService.getApiSizesById({ id }) });
export const ensureUseSizeControllerServiceGetApiSizesData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseSizeControllerServiceGetApiSizesKeyFn(), queryFn: () => SizeControllerService.getApiSizes() });
export const ensureUseReviewControllerServiceGetApiReviewsByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseReviewControllerServiceGetApiReviewsByIdKeyFn({ id }), queryFn: () => ReviewControllerService.getApiReviewsById({ id }) });
export const ensureUseReviewControllerServiceGetApiReviewsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseReviewControllerServiceGetApiReviewsKeyFn(), queryFn: () => ReviewControllerService.getApiReviews() });
export const ensureUsePromotionProductControllerServiceGetApiPromotionProductsByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UsePromotionProductControllerServiceGetApiPromotionProductsByIdKeyFn({ id }), queryFn: () => PromotionProductControllerService.getApiPromotionProductsById({ id }) });
export const ensureUsePromotionProductControllerServiceGetApiPromotionProductsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UsePromotionProductControllerServiceGetApiPromotionProductsKeyFn(), queryFn: () => PromotionProductControllerService.getApiPromotionProducts() });
export const ensureUseProductControllerServiceGetApiProductsByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseProductControllerServiceGetApiProductsByIdKeyFn({ id }), queryFn: () => ProductControllerService.getApiProductsById({ id }) });
export const ensureUseProductControllerServiceGetApiProductsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseProductControllerServiceGetApiProductsKeyFn(), queryFn: () => ProductControllerService.getApiProducts() });
export const ensureUseProductVariantControllerServiceGetApiProductVariantsByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseProductVariantControllerServiceGetApiProductVariantsByIdKeyFn({ id }), queryFn: () => ProductVariantControllerService.getApiProductVariantsById({ id }) });
export const ensureUseProductVariantControllerServiceGetApiProductVariantsData = (queryClient: QueryClient, { productId }: {
  productId?: string;
} = {}) => queryClient.ensureQueryData({ queryKey: Common.UseProductVariantControllerServiceGetApiProductVariantsKeyFn({ productId }), queryFn: () => ProductVariantControllerService.getApiProductVariants({ productId }) });
export const ensureUseOrderControllerServiceGetApiOrdersByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseOrderControllerServiceGetApiOrdersByIdKeyFn({ id }), queryFn: () => OrderControllerService.getApiOrdersById({ id }) });
export const ensureUseOrderControllerServiceGetApiOrdersData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseOrderControllerServiceGetApiOrdersKeyFn(), queryFn: () => OrderControllerService.getApiOrders() });
export const ensureUseOrderControllerServiceGetApiOrdersUserOrdersData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseOrderControllerServiceGetApiOrdersUserOrdersKeyFn(), queryFn: () => OrderControllerService.getApiOrdersUserOrders() });
export const ensureUseCategoryControllerServiceGetApiCategoriesByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseCategoryControllerServiceGetApiCategoriesByIdKeyFn({ id }), queryFn: () => CategoryControllerService.getApiCategoriesById({ id }) });
export const ensureUseCategoryControllerServiceGetApiCategoriesData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseCategoryControllerServiceGetApiCategoriesKeyFn(), queryFn: () => CategoryControllerService.getApiCategories() });
export const ensureUseHeadingControllerServiceGetApiHeadingsData = (queryClient: QueryClient) => queryClient.ensureQueryData({ queryKey: Common.UseHeadingControllerServiceGetApiHeadingsKeyFn(), queryFn: () => HeadingControllerService.getApiHeadings() });
export const ensureUseHeadingControllerServiceGetApiHeadingsByIdData = (queryClient: QueryClient, { id }: {
  id: string;
}) => queryClient.ensureQueryData({ queryKey: Common.UseHeadingControllerServiceGetApiHeadingsByIdKeyFn({ id }), queryFn: () => HeadingControllerService.getApiHeadingsById({ id }) });
