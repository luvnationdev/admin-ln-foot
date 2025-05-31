// generated with @7nohe/openapi-react-query-codegen@1.6.2

import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { CategoryControllerService, HeadingControllerService, OrderControllerService, ProductControllerService, ProductVariantControllerService, PromotionProductControllerService, ReviewControllerService, SizeControllerService } from "../requests/services.gen";
import { BulkProductVariantDto, CategoryDto, Customer, HeadingDto, OrderDto, ProductDto, ProductVariantDto, PromotionProductDto, ReviewDto, SizeDto } from "../requests/types.gen";
import * as Common from "./common";
export const useSizeControllerServiceGetApiSizesById = <TData = Common.SizeControllerServiceGetApiSizesByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSizeControllerServiceGetApiSizesByIdKeyFn({ id }, queryKey), queryFn: () => SizeControllerService.getApiSizesById({ id }) as TData, ...options });
export const useSizeControllerServiceGetApiSizes = <TData = Common.SizeControllerServiceGetApiSizesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseSizeControllerServiceGetApiSizesKeyFn(queryKey), queryFn: () => SizeControllerService.getApiSizes() as TData, ...options });
export const useReviewControllerServiceGetApiReviewsById = <TData = Common.ReviewControllerServiceGetApiReviewsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseReviewControllerServiceGetApiReviewsByIdKeyFn({ id }, queryKey), queryFn: () => ReviewControllerService.getApiReviewsById({ id }) as TData, ...options });
export const useReviewControllerServiceGetApiReviews = <TData = Common.ReviewControllerServiceGetApiReviewsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseReviewControllerServiceGetApiReviewsKeyFn(queryKey), queryFn: () => ReviewControllerService.getApiReviews() as TData, ...options });
export const usePromotionProductControllerServiceGetApiPromotionProductsById = <TData = Common.PromotionProductControllerServiceGetApiPromotionProductsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UsePromotionProductControllerServiceGetApiPromotionProductsByIdKeyFn({ id }, queryKey), queryFn: () => PromotionProductControllerService.getApiPromotionProductsById({ id }) as TData, ...options });
export const usePromotionProductControllerServiceGetApiPromotionProducts = <TData = Common.PromotionProductControllerServiceGetApiPromotionProductsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UsePromotionProductControllerServiceGetApiPromotionProductsKeyFn(queryKey), queryFn: () => PromotionProductControllerService.getApiPromotionProducts() as TData, ...options });
export const useProductControllerServiceGetApiProductsById = <TData = Common.ProductControllerServiceGetApiProductsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseProductControllerServiceGetApiProductsByIdKeyFn({ id }, queryKey), queryFn: () => ProductControllerService.getApiProductsById({ id }) as TData, ...options });
export const useProductControllerServiceGetApiProducts = <TData = Common.ProductControllerServiceGetApiProductsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseProductControllerServiceGetApiProductsKeyFn(queryKey), queryFn: () => ProductControllerService.getApiProducts() as TData, ...options });
export const useProductVariantControllerServiceGetApiProductVariantsById = <TData = Common.ProductVariantControllerServiceGetApiProductVariantsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseProductVariantControllerServiceGetApiProductVariantsByIdKeyFn({ id }, queryKey), queryFn: () => ProductVariantControllerService.getApiProductVariantsById({ id }) as TData, ...options });
export const useProductVariantControllerServiceGetApiProductVariants = <TData = Common.ProductVariantControllerServiceGetApiProductVariantsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ productId }: {
  productId?: string;
} = {}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseProductVariantControllerServiceGetApiProductVariantsKeyFn({ productId }, queryKey), queryFn: () => ProductVariantControllerService.getApiProductVariants({ productId }) as TData, ...options });
export const useOrderControllerServiceGetApiOrdersById = <TData = Common.OrderControllerServiceGetApiOrdersByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseOrderControllerServiceGetApiOrdersByIdKeyFn({ id }, queryKey), queryFn: () => OrderControllerService.getApiOrdersById({ id }) as TData, ...options });
export const useOrderControllerServiceGetApiOrders = <TData = Common.OrderControllerServiceGetApiOrdersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseOrderControllerServiceGetApiOrdersKeyFn(queryKey), queryFn: () => OrderControllerService.getApiOrders() as TData, ...options });
export const useOrderControllerServiceGetApiOrdersUserOrders = <TData = Common.OrderControllerServiceGetApiOrdersUserOrdersDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseOrderControllerServiceGetApiOrdersUserOrdersKeyFn(queryKey), queryFn: () => OrderControllerService.getApiOrdersUserOrders() as TData, ...options });
export const useCategoryControllerServiceGetApiCategoriesById = <TData = Common.CategoryControllerServiceGetApiCategoriesByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCategoryControllerServiceGetApiCategoriesByIdKeyFn({ id }, queryKey), queryFn: () => CategoryControllerService.getApiCategoriesById({ id }) as TData, ...options });
export const useCategoryControllerServiceGetApiCategories = <TData = Common.CategoryControllerServiceGetApiCategoriesDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseCategoryControllerServiceGetApiCategoriesKeyFn(queryKey), queryFn: () => CategoryControllerService.getApiCategories() as TData, ...options });
export const useHeadingControllerServiceGetApiHeadings = <TData = Common.HeadingControllerServiceGetApiHeadingsDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseHeadingControllerServiceGetApiHeadingsKeyFn(queryKey), queryFn: () => HeadingControllerService.getApiHeadings() as TData, ...options });
export const useHeadingControllerServiceGetApiHeadingsById = <TData = Common.HeadingControllerServiceGetApiHeadingsByIdDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
  id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn">) => useQuery<TData, TError>({ queryKey: Common.UseHeadingControllerServiceGetApiHeadingsByIdKeyFn({ id }, queryKey), queryFn: () => HeadingControllerService.getApiHeadingsById({ id }) as TData, ...options });
export const useSizeControllerServicePostApiSizes = <TData = Common.SizeControllerServicePostApiSizesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: SizeDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: SizeDto;
}, TContext>({ mutationFn: ({ requestBody }) => SizeControllerService.postApiSizes({ requestBody }) as unknown as Promise<TData>, ...options });
export const useReviewControllerServicePostApiReviews = <TData = Common.ReviewControllerServicePostApiReviewsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: ReviewDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: ReviewDto;
}, TContext>({ mutationFn: ({ requestBody }) => ReviewControllerService.postApiReviews({ requestBody }) as unknown as Promise<TData>, ...options });
export const usePromotionProductControllerServicePostApiPromotionProducts = <TData = Common.PromotionProductControllerServicePostApiPromotionProductsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PromotionProductDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PromotionProductDto;
}, TContext>({ mutationFn: ({ requestBody }) => PromotionProductControllerService.postApiPromotionProducts({ requestBody }) as unknown as Promise<TData>, ...options });
export const usePromotionProductControllerServicePostApiPromotionProductsBatch = <TData = Common.PromotionProductControllerServicePostApiPromotionProductsBatchMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: PromotionProductDto[];
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: PromotionProductDto[];
}, TContext>({ mutationFn: ({ requestBody }) => PromotionProductControllerService.postApiPromotionProductsBatch({ requestBody }) as unknown as Promise<TData>, ...options });
export const useProductControllerServicePostApiProducts = <TData = Common.ProductControllerServicePostApiProductsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: ProductDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: ProductDto;
}, TContext>({ mutationFn: ({ formData }) => ProductControllerService.postApiProducts({ formData }) as unknown as Promise<TData>, ...options });
export const useProductVariantControllerServicePostApiProductVariants = <TData = Common.ProductVariantControllerServicePostApiProductVariantsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: ProductVariantDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: ProductVariantDto;
}, TContext>({ mutationFn: ({ formData }) => ProductVariantControllerService.postApiProductVariants({ formData }) as unknown as Promise<TData>, ...options });
export const useProductVariantControllerServicePostApiProductVariantsBulk = <TData = Common.ProductVariantControllerServicePostApiProductVariantsBulkMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  formData?: BulkProductVariantDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  formData?: BulkProductVariantDto;
}, TContext>({ mutationFn: ({ formData }) => ProductVariantControllerService.postApiProductVariantsBulk({ formData }) as unknown as Promise<TData>, ...options });
export const useOrderControllerServicePostApiOrders = <TData = Common.OrderControllerServicePostApiOrdersMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: OrderDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: OrderDto;
}, TContext>({ mutationFn: ({ requestBody }) => OrderControllerService.postApiOrders({ requestBody }) as unknown as Promise<TData>, ...options });
export const useCategoryControllerServicePostApiCategories = <TData = Common.CategoryControllerServicePostApiCategoriesMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: CategoryDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: CategoryDto;
}, TContext>({ mutationFn: ({ requestBody }) => CategoryControllerService.postApiCategories({ requestBody }) as unknown as Promise<TData>, ...options });
export const useHeadingControllerServicePostApiHeadings = <TData = Common.HeadingControllerServicePostApiHeadingsMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  requestBody: HeadingDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  requestBody: HeadingDto;
}, TContext>({ mutationFn: ({ requestBody }) => HeadingControllerService.postApiHeadings({ requestBody }) as unknown as Promise<TData>, ...options });
export const useSizeControllerServicePutApiSizesById = <TData = Common.SizeControllerServicePutApiSizesByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody: SizeDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody: SizeDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => SizeControllerService.putApiSizesById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useReviewControllerServicePutApiReviewsById = <TData = Common.ReviewControllerServicePutApiReviewsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody: ReviewDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody: ReviewDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => ReviewControllerService.putApiReviewsById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const usePromotionProductControllerServicePutApiPromotionProductsById = <TData = Common.PromotionProductControllerServicePutApiPromotionProductsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody: PromotionProductDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody: PromotionProductDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => PromotionProductControllerService.putApiPromotionProductsById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useProductControllerServicePutApiProductsById = <TData = Common.ProductControllerServicePutApiProductsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody?: ProductDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody?: ProductDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => ProductControllerService.putApiProductsById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useProductVariantControllerServicePutApiProductVariantsById = <TData = Common.ProductVariantControllerServicePutApiProductVariantsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody?: ProductVariantDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody?: ProductVariantDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => ProductVariantControllerService.putApiProductVariantsById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useOrderControllerServicePutApiOrdersById = <TData = Common.OrderControllerServicePutApiOrdersByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody: OrderDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody: OrderDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => OrderControllerService.putApiOrdersById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useOrderControllerServicePutApiOrdersByIdConfirm = <TData = Common.OrderControllerServicePutApiOrdersByIdConfirmMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody: Customer;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody: Customer;
}, TContext>({ mutationFn: ({ id, requestBody }) => OrderControllerService.putApiOrdersByIdConfirm({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useCategoryControllerServicePutApiCategoriesById = <TData = Common.CategoryControllerServicePutApiCategoriesByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
  requestBody: CategoryDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
  requestBody: CategoryDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => CategoryControllerService.putApiCategoriesById({ id, requestBody }) as unknown as Promise<TData>, ...options });
export const useSizeControllerServiceDeleteApiSizesById = <TData = Common.SizeControllerServiceDeleteApiSizesByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => SizeControllerService.deleteApiSizesById({ id }) as unknown as Promise<TData>, ...options });
export const useReviewControllerServiceDeleteApiReviewsById = <TData = Common.ReviewControllerServiceDeleteApiReviewsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => ReviewControllerService.deleteApiReviewsById({ id }) as unknown as Promise<TData>, ...options });
export const usePromotionProductControllerServiceDeleteApiPromotionProductsById = <TData = Common.PromotionProductControllerServiceDeleteApiPromotionProductsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => PromotionProductControllerService.deleteApiPromotionProductsById({ id }) as unknown as Promise<TData>, ...options });
export const useProductControllerServiceDeleteApiProductsById = <TData = Common.ProductControllerServiceDeleteApiProductsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => ProductControllerService.deleteApiProductsById({ id }) as unknown as Promise<TData>, ...options });
export const useProductVariantControllerServiceDeleteApiProductVariantsById = <TData = Common.ProductVariantControllerServiceDeleteApiProductVariantsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => ProductVariantControllerService.deleteApiProductVariantsById({ id }) as unknown as Promise<TData>, ...options });
export const useOrderControllerServiceDeleteApiOrdersById = <TData = Common.OrderControllerServiceDeleteApiOrdersByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => OrderControllerService.deleteApiOrdersById({ id }) as unknown as Promise<TData>, ...options });
export const useCategoryControllerServiceDeleteApiCategoriesById = <TData = Common.CategoryControllerServiceDeleteApiCategoriesByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => CategoryControllerService.deleteApiCategoriesById({ id }) as unknown as Promise<TData>, ...options });
export const useHeadingControllerServiceDeleteApiHeadingsById = <TData = Common.HeadingControllerServiceDeleteApiHeadingsByIdMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
  id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
  id: string;
}, TContext>({ mutationFn: ({ id }) => HeadingControllerService.deleteApiHeadingsById({ id }) as unknown as Promise<TData>, ...options });
