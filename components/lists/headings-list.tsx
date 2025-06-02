// Ensure this component is a client component if not already
"use client";

import { useEffect } from 'react'; // Keep useEffect for error handling if needed
import { toast } from 'sonner';
import { useHeadingControllerServiceGetApiHeadings } from '@/lib/api-client/rq-generated/queries'; // Updated import for RQ hook
import type { HeadingDto } from '@/lib/api-client/rq-generated/requests/types.gen'; // Updated import for DTO

// Optional: A skeleton loader component
function HeadingSkeleton() {
  return (
    <div className='border rounded-md p-4 shadow-sm bg-white animate-pulse'>
      <div className='w-full h-40 bg-gray-300 rounded-md mb-2'></div>
      <div className='h-6 bg-gray-300 rounded w-3/4'></div>
    </div>
  );
}

export function HeadingsList() {
  const {
    data: rawHeadingsData, // Rename to avoid conflict if not using select, or use data directly if select is used
    error,
    isLoading
  } = useHeadingControllerServiceGetApiHeadings(
    undefined, // queryKey parameters (none for this specific getAll type of query)
    {
      // React Query options
      refetchInterval: 60000, // Polling every 60 seconds
      select: (apiResponse) => {
        // Assuming apiResponse is directly HeadingDto[] as per typical codegen config (serviceResponse: 'body')
        // If apiResponse is { data: HeadingDto[], ...}, adjust accordingly: apiResponse.data.map(...)
        return apiResponse.map((heading: HeadingDto) => ({ // Ensure 'heading' is typed if needed
          id: heading.id,
          title: heading.title ?? '',
          imageUrl: heading.imageUrl ?? '',
        }));
      }
    }
  );

  // Handle error state with an effect
  useEffect(() => {
    if (error) {
      toast.error('Erreur lors de la récupération des titres');
      console.error('Error fetching headings:', error);
    }
  }, [error]);

  if (isLoading) {
    // Render skeletons or a simple loading message
    return (
      <div className='grid gap-4 sm:grid-cols-2'>
        <HeadingSkeleton />
        <HeadingSkeleton />
      </div>
    );
  }

  // 'rawHeadingsData' is now the result of the 'select' function.
  // If 'select' is not used, you would map over 'rawHeadingsData' here.
  const headings = rawHeadingsData;

  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      {headings?.map((heading, idx) => (
        <div key={heading.id ?? idx} className='border rounded-md p-4 shadow-sm bg-white'> {/* Use heading.id for key if available */}
          <img
            src={heading.imageUrl}
            alt={heading.title}
            className='w-full h-40 object-cover rounded-md mb-2'
          />
          <h2 className='text-lg font-semibold'>{heading.title}</h2>
        </div>
      ))}
      {(!headings || headings.length === 0) && !isLoading && (
        <p className="col-span-full text-center text-gray-500">Aucun titre trouvé.</p>
      )}
    </div>
  );
}
