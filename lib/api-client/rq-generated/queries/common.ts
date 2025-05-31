// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { UseQueryResult } from "@tanstack/react-query";
import { CategoryControllerService, HeadingControllerService, OrderControllerService, ProductControllerService, ProductVariantControllerService, PromotionProductControllerService, ReviewControllerService, SizeControllerService } from "../requests/services.gen";
export type SizeControllerServiceGetApiSizesByIdDefaultResponse = Awaited<ReturnType<typeof SizeControllerService.getApiSizesById>>;
export type SizeControllerServiceGetApiSizesByIdQueryResult<TData = SizeControllerServiceGetApiSizesByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSizeControllerServiceGetApiSizesByIdKey = "SizeControllerServiceGetApiSizesById";
export const UseSizeControllerServiceGetApiSizesByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useSizeControllerServiceGetApiSizesByIdKey, ...(queryKey ?? [{ id }])];
export type SizeControllerServiceGetApiSizesDefaultResponse = Awaited<ReturnType<typeof SizeControllerService.getApiSizes>>;
export type SizeControllerServiceGetApiSizesQueryResult<TData = SizeControllerServiceGetApiSizesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useSizeControllerServiceGetApiSizesKey = "SizeControllerServiceGetApiSizes";
export const UseSizeControllerServiceGetApiSizesKeyFn = (queryKey?: Array<unknown>) => [useSizeControllerServiceGetApiSizesKey, ...(queryKey ?? [])];
export type ReviewControllerServiceGetApiReviewsByIdDefaultResponse = Awaited<ReturnType<typeof ReviewControllerService.getApiReviewsById>>;
export type ReviewControllerServiceGetApiReviewsByIdQueryResult<TData = ReviewControllerServiceGetApiReviewsByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useReviewControllerServiceGetApiReviewsByIdKey = "ReviewControllerServiceGetApiReviewsById";
export const UseReviewControllerServiceGetApiReviewsByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useReviewControllerServiceGetApiReviewsByIdKey, ...(queryKey ?? [{ id }])];
export type ReviewControllerServiceGetApiReviewsDefaultResponse = Awaited<ReturnType<typeof ReviewControllerService.getApiReviews>>;
export type ReviewControllerServiceGetApiReviewsQueryResult<TData = ReviewControllerServiceGetApiReviewsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useReviewControllerServiceGetApiReviewsKey = "ReviewControllerServiceGetApiReviews";
export const UseReviewControllerServiceGetApiReviewsKeyFn = (queryKey?: Array<unknown>) => [useReviewControllerServiceGetApiReviewsKey, ...(queryKey ?? [])];
export type PromotionProductControllerServiceGetApiPromotionProductsByIdDefaultResponse = Awaited<ReturnType<typeof PromotionProductControllerService.getApiPromotionProductsById>>;
export type PromotionProductControllerServiceGetApiPromotionProductsByIdQueryResult<TData = PromotionProductControllerServiceGetApiPromotionProductsByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const usePromotionProductControllerServiceGetApiPromotionProductsByIdKey = "PromotionProductControllerServiceGetApiPromotionProductsById";
export const UsePromotionProductControllerServiceGetApiPromotionProductsByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [usePromotionProductControllerServiceGetApiPromotionProductsByIdKey, ...(queryKey ?? [{ id }])];
export type PromotionProductControllerServiceGetApiPromotionProductsDefaultResponse = Awaited<ReturnType<typeof PromotionProductControllerService.getApiPromotionProducts>>;
export type PromotionProductControllerServiceGetApiPromotionProductsQueryResult<TData = PromotionProductControllerServiceGetApiPromotionProductsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const usePromotionProductControllerServiceGetApiPromotionProductsKey = "PromotionProductControllerServiceGetApiPromotionProducts";
export const UsePromotionProductControllerServiceGetApiPromotionProductsKeyFn = (queryKey?: Array<unknown>) => [usePromotionProductControllerServiceGetApiPromotionProductsKey, ...(queryKey ?? [])];
export type ProductControllerServiceGetApiProductsByIdDefaultResponse = Awaited<ReturnType<typeof ProductControllerService.getApiProductsById>>;
export type ProductControllerServiceGetApiProductsByIdQueryResult<TData = ProductControllerServiceGetApiProductsByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProductControllerServiceGetApiProductsByIdKey = "ProductControllerServiceGetApiProductsById";
export const UseProductControllerServiceGetApiProductsByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useProductControllerServiceGetApiProductsByIdKey, ...(queryKey ?? [{ id }])];
export type ProductControllerServiceGetApiProductsDefaultResponse = Awaited<ReturnType<typeof ProductControllerService.getApiProducts>>;
export type ProductControllerServiceGetApiProductsQueryResult<TData = ProductControllerServiceGetApiProductsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProductControllerServiceGetApiProductsKey = "ProductControllerServiceGetApiProducts";
export const UseProductControllerServiceGetApiProductsKeyFn = (queryKey?: Array<unknown>) => [useProductControllerServiceGetApiProductsKey, ...(queryKey ?? [])];
export type ProductVariantControllerServiceGetApiProductVariantsByIdDefaultResponse = Awaited<ReturnType<typeof ProductVariantControllerService.getApiProductVariantsById>>;
export type ProductVariantControllerServiceGetApiProductVariantsByIdQueryResult<TData = ProductVariantControllerServiceGetApiProductVariantsByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProductVariantControllerServiceGetApiProductVariantsByIdKey = "ProductVariantControllerServiceGetApiProductVariantsById";
export const UseProductVariantControllerServiceGetApiProductVariantsByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useProductVariantControllerServiceGetApiProductVariantsByIdKey, ...(queryKey ?? [{ id }])];
export type ProductVariantControllerServiceGetApiProductVariantsDefaultResponse = Awaited<ReturnType<typeof ProductVariantControllerService.getApiProductVariants>>;
export type ProductVariantControllerServiceGetApiProductVariantsQueryResult<TData = ProductVariantControllerServiceGetApiProductVariantsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProductVariantControllerServiceGetApiProductVariantsKey = "ProductVariantControllerServiceGetApiProductVariants";
export const UseProductVariantControllerServiceGetApiProductVariantsKeyFn = ({ productId }: {
  productId?: string;
} = {}, queryKey?: Array<unknown>) => [useProductVariantControllerServiceGetApiProductVariantsKey, ...(queryKey ?? [{ productId }])];
export type OrderControllerServiceGetApiOrdersByIdDefaultResponse = Awaited<ReturnType<typeof OrderControllerService.getApiOrdersById>>;
export type OrderControllerServiceGetApiOrdersByIdQueryResult<TData = OrderControllerServiceGetApiOrdersByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useOrderControllerServiceGetApiOrdersByIdKey = "OrderControllerServiceGetApiOrdersById";
export const UseOrderControllerServiceGetApiOrdersByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useOrderControllerServiceGetApiOrdersByIdKey, ...(queryKey ?? [{ id }])];
export type OrderControllerServiceGetApiOrdersDefaultResponse = Awaited<ReturnType<typeof OrderControllerService.getApiOrders>>;
export type OrderControllerServiceGetApiOrdersQueryResult<TData = OrderControllerServiceGetApiOrdersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useOrderControllerServiceGetApiOrdersKey = "OrderControllerServiceGetApiOrders";
export const UseOrderControllerServiceGetApiOrdersKeyFn = (queryKey?: Array<unknown>) => [useOrderControllerServiceGetApiOrdersKey, ...(queryKey ?? [])];
export type OrderControllerServiceGetApiOrdersUserOrdersDefaultResponse = Awaited<ReturnType<typeof OrderControllerService.getApiOrdersUserOrders>>;
export type OrderControllerServiceGetApiOrdersUserOrdersQueryResult<TData = OrderControllerServiceGetApiOrdersUserOrdersDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useOrderControllerServiceGetApiOrdersUserOrdersKey = "OrderControllerServiceGetApiOrdersUserOrders";
export const UseOrderControllerServiceGetApiOrdersUserOrdersKeyFn = (queryKey?: Array<unknown>) => [useOrderControllerServiceGetApiOrdersUserOrdersKey, ...(queryKey ?? [])];
export type CategoryControllerServiceGetApiCategoriesByIdDefaultResponse = Awaited<ReturnType<typeof CategoryControllerService.getApiCategoriesById>>;
export type CategoryControllerServiceGetApiCategoriesByIdQueryResult<TData = CategoryControllerServiceGetApiCategoriesByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCategoryControllerServiceGetApiCategoriesByIdKey = "CategoryControllerServiceGetApiCategoriesById";
export const UseCategoryControllerServiceGetApiCategoriesByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useCategoryControllerServiceGetApiCategoriesByIdKey, ...(queryKey ?? [{ id }])];
export type CategoryControllerServiceGetApiCategoriesDefaultResponse = Awaited<ReturnType<typeof CategoryControllerService.getApiCategories>>;
export type CategoryControllerServiceGetApiCategoriesQueryResult<TData = CategoryControllerServiceGetApiCategoriesDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useCategoryControllerServiceGetApiCategoriesKey = "CategoryControllerServiceGetApiCategories";
export const UseCategoryControllerServiceGetApiCategoriesKeyFn = (queryKey?: Array<unknown>) => [useCategoryControllerServiceGetApiCategoriesKey, ...(queryKey ?? [])];
export type HeadingControllerServiceGetApiHeadingsDefaultResponse = Awaited<ReturnType<typeof HeadingControllerService.getApiHeadings>>;
export type HeadingControllerServiceGetApiHeadingsQueryResult<TData = HeadingControllerServiceGetApiHeadingsDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useHeadingControllerServiceGetApiHeadingsKey = "HeadingControllerServiceGetApiHeadings";
export const UseHeadingControllerServiceGetApiHeadingsKeyFn = (queryKey?: Array<unknown>) => [useHeadingControllerServiceGetApiHeadingsKey, ...(queryKey ?? [])];
export type HeadingControllerServiceGetApiHeadingsByIdDefaultResponse = Awaited<ReturnType<typeof HeadingControllerService.getApiHeadingsById>>;
export type HeadingControllerServiceGetApiHeadingsByIdQueryResult<TData = HeadingControllerServiceGetApiHeadingsByIdDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useHeadingControllerServiceGetApiHeadingsByIdKey = "HeadingControllerServiceGetApiHeadingsById";
export const UseHeadingControllerServiceGetApiHeadingsByIdKeyFn = ({ id }: {
  id: string;
}, queryKey?: Array<unknown>) => [useHeadingControllerServiceGetApiHeadingsByIdKey, ...(queryKey ?? [{ id }])];
export type SizeControllerServicePostApiSizesMutationResult = Awaited<ReturnType<typeof SizeControllerService.postApiSizes>>;
export type ReviewControllerServicePostApiReviewsMutationResult = Awaited<ReturnType<typeof ReviewControllerService.postApiReviews>>;
export type PromotionProductControllerServicePostApiPromotionProductsMutationResult = Awaited<ReturnType<typeof PromotionProductControllerService.postApiPromotionProducts>>;
export type PromotionProductControllerServicePostApiPromotionProductsBatchMutationResult = Awaited<ReturnType<typeof PromotionProductControllerService.postApiPromotionProductsBatch>>;
export type ProductControllerServicePostApiProductsMutationResult = Awaited<ReturnType<typeof ProductControllerService.postApiProducts>>;
export type ProductVariantControllerServicePostApiProductVariantsMutationResult = Awaited<ReturnType<typeof ProductVariantControllerService.postApiProductVariants>>;
export type ProductVariantControllerServicePostApiProductVariantsBulkMutationResult = Awaited<ReturnType<typeof ProductVariantControllerService.postApiProductVariantsBulk>>;
export type OrderControllerServicePostApiOrdersMutationResult = Awaited<ReturnType<typeof OrderControllerService.postApiOrders>>;
export type CategoryControllerServicePostApiCategoriesMutationResult = Awaited<ReturnType<typeof CategoryControllerService.postApiCategories>>;
export type HeadingControllerServicePostApiHeadingsMutationResult = Awaited<ReturnType<typeof HeadingControllerService.postApiHeadings>>;
export type SizeControllerServicePutApiSizesByIdMutationResult = Awaited<ReturnType<typeof SizeControllerService.putApiSizesById>>;
export type ReviewControllerServicePutApiReviewsByIdMutationResult = Awaited<ReturnType<typeof ReviewControllerService.putApiReviewsById>>;
export type PromotionProductControllerServicePutApiPromotionProductsByIdMutationResult = Awaited<ReturnType<typeof PromotionProductControllerService.putApiPromotionProductsById>>;
export type ProductControllerServicePutApiProductsByIdMutationResult = Awaited<ReturnType<typeof ProductControllerService.putApiProductsById>>;
export type ProductVariantControllerServicePutApiProductVariantsByIdMutationResult = Awaited<ReturnType<typeof ProductVariantControllerService.putApiProductVariantsById>>;
export type OrderControllerServicePutApiOrdersByIdMutationResult = Awaited<ReturnType<typeof OrderControllerService.putApiOrdersById>>;
export type OrderControllerServicePutApiOrdersByIdConfirmMutationResult = Awaited<ReturnType<typeof OrderControllerService.putApiOrdersByIdConfirm>>;
export type CategoryControllerServicePutApiCategoriesByIdMutationResult = Awaited<ReturnType<typeof CategoryControllerService.putApiCategoriesById>>;
export type SizeControllerServiceDeleteApiSizesByIdMutationResult = Awaited<ReturnType<typeof SizeControllerService.deleteApiSizesById>>;
export type ReviewControllerServiceDeleteApiReviewsByIdMutationResult = Awaited<ReturnType<typeof ReviewControllerService.deleteApiReviewsById>>;
export type PromotionProductControllerServiceDeleteApiPromotionProductsByIdMutationResult = Awaited<ReturnType<typeof PromotionProductControllerService.deleteApiPromotionProductsById>>;
export type ProductControllerServiceDeleteApiProductsByIdMutationResult = Awaited<ReturnType<typeof ProductControllerService.deleteApiProductsById>>;
export type ProductVariantControllerServiceDeleteApiProductVariantsByIdMutationResult = Awaited<ReturnType<typeof ProductVariantControllerService.deleteApiProductVariantsById>>;
export type OrderControllerServiceDeleteApiOrdersByIdMutationResult = Awaited<ReturnType<typeof OrderControllerService.deleteApiOrdersById>>;
export type CategoryControllerServiceDeleteApiCategoriesByIdMutationResult = Awaited<ReturnType<typeof CategoryControllerService.deleteApiCategoriesById>>;
export type HeadingControllerServiceDeleteApiHeadingsByIdMutationResult = Awaited<ReturnType<typeof HeadingControllerService.deleteApiHeadingsById>>;
