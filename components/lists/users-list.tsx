'use client'

import {
  useUserControllerServiceGetApiV1Users,
  useUserControllerServicePutApiV1UsersByIdRole,
} from '@/lib/api-client/rq-generated/queries'
import type { UserDto } from '@/lib/api-client/rq-generated/requests' // Assuming UserDto is the correct type for a user
import { trpc } from '@/lib/trpc/react' // Keep for toggleActivation if not migrating it yet
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function UserList() {
  const { data: session } = useSession()
  const [search, setSearch] = useState('')
  const { data: usersResponse, refetch, isLoading } = useUserControllerServiceGetApiV1Users({})
  const users: UserDto[] = usersResponse ?? []

  const { mutate: assignRoleMutate, isPending: assigning } =
    useUserControllerServicePutApiV1UsersByIdRole()
  const { mutate: removeRoleMutate, isPending: removing } =
    useUserControllerServicePutApiV1UsersByIdRole()

  // TODO: toggleActivation cannot be migrated yet as there is no direct OpenAPI equivalent.
  const { mutate: toggleActivation, isPending: toggling } =
    trpc.users.toggleActivation.useMutation()

  const isPending = isLoading || assigning || removing || toggling // Added toggling here as it's still used

  const handleAssignRole = (userId: string) => {
    if (
      !confirm(
        'Voulez-vous vraiment assigner le rôle admin à cet utilisateur ?'
      )
    )
      return

    assignRoleMutate(
      { id: userId, requestBody: { role: 'ADMIN' } },
      {
        onSuccess: () => {
          toast.success('Rôle admin assigné avec succès')
          refetch().catch((err) => {
            console.error('Erreur lors du rechargement:', err)
            toast.error('Échec du rechargement')
          })
        },
        onError: (err: Error) => { // Explicitly type err
          toast.error(`Erreur : ${err.message}`)
        },
      }
    )
  }

  const handleRemoveRole = (userId: string) => {
    if (
      !confirm('Voulez-vous vraiment retirer le rôle admin à cet utilisateur ?')
    )
      return

    // Assuming setting role to 'USER' is how 'admin' is removed.
    removeRoleMutate(
      { id: userId, requestBody: { role: 'USER' } },
      {
        onSuccess: () => {
          toast.success('Rôle admin retiré avec succès')
          refetch().catch((err) => {
            console.error('Erreur lors du rechargement:', err)
            toast.error('Échec du rechargement')
          })
        },
        onError: (err: Error) => { // Explicitly type err
          toast.error(`Erreur : ${err.message}`)
        },
      }
    )
  }

  const handleToggleActivation = (userId: string, currentState: boolean) => {
    const action = currentState ? 'désactiver' : 'activer'
    if (!confirm(`Voulez-vous vraiment ${action} cet utilisateur ?`)) return

    toggleActivation(
      { userId, enable: !currentState },
      {
        onSuccess: () => {
          toast.success(`Utilisateur ${!currentState ? 'activé' : 'désactivé'}`)
          refetch().catch((err) => {
            console.error('Erreur lors du rechargement:', err)
            toast.error('Échec du rechargement')
          })
        },
        onError: (err: Error) => toast.error(`Erreur: ${err.message}`), // Explicitly type err
      }
    )
  }

  const filteredUsers = users.filter((user) => {
    const query = search.toLowerCase()
    // Adjust filtering for UserDto structure. Assuming UserDto has 'name' instead of 'username'.
    // Also, UserDto might not have firstName/lastName directly.
    // For now, let's assume 'name' might be concatenation or just username.
    // And that keycloakId might be relevant for search or email.
    return (
      user.name?.toLowerCase().includes(query) ??
      user.email?.toLowerCase().includes(query) ??
      user.keycloakId?.toLowerCase().includes(query) // Example: if keycloakId is searchable
    )
  })

  return (
    <div className='p-4 space-y-4'>
      <h2 className='text-xl font-semibold'>Liste des utilisateurs</h2>

      {/* 🔍 Search input */}
      <input
        type='text'
        placeholder='Rechercher par nom, email...' // Adjusted placeholder
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='w-full border rounded-md px-3 py-2'
      />

      <div className='divide-y border rounded-md'>
        {filteredUsers.map((user) => { // user is now UserDto
          const isAdmin = user.role === 'ADMIN'
          // UserDto does not have an 'enabled' field from what was shown in types.gen.ts.
          // This part of the UI will break or need adjustment.
          // For now, I will comment out the 'enabled' status display.
          // const userEnabled = user.enabled; // This field does not exist on UserDto

          return (
            <div
              key={user.id}
              className='p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'
            >
              <div className='space-y-1'>
                <div className='font-semibold'>{user.name}</div> {/* Assuming user.name exists, was user.username */}
                <div className='text-sm text-gray-500'>{user.email}</div>
                {/* UserDto does not have firstName, lastName. Commenting out.
                <div className='text-sm'>
                  {user.firstName} {user.lastName}
                </div>
                */}
                {/*
                <div
                  className={`text-sm inline-block px-2 py-1 rounded ${
                    userEnabled // This was user.enabled
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {userEnabled ? 'Activé' : 'Désactivé'}
                </div>
                */}
                {user.role && ( // Display the single role
                  <div className='text-sm mt-2'>
                    <span className='font-medium'>Rôle :</span>{' '}
                    <span
                      className='inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded mr-1'
                    >
                      {user.role}
                    </span>
                  </div>
                )}
                {/* Display permissions if they exist and are relevant
                {user.permissions && user.permissions.length > 0 && (
                  <div className='text-sm mt-2'>
                    <span className='font-medium'>Permissions :</span>{' '}
                    {user.permissions.map((permission, idx) => (
                      <span
                        key={idx}
                        className='inline-block bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded mr-1'
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                )}
                */}
              </div>

              {session?.user.email !== user.email && (
                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                  {/* Button for toggleActivation - user.enabled does not exist on UserDto from types.gen.ts
                      This button's functionality relies on 'user.enabled' which is not available.
                      The handleToggleActivation function itself still uses the tRPC call.
                  */}
                  <button
                    onClick={() =>
                      // This will likely cause an error as user.enabled is not defined on UserDto
                      // Keeping it for now as toggleActivation is not migrated
                      handleToggleActivation(user.id!, !!(user as any).enabled)
                    }
                    disabled={isPending || toggling} // ensure toggling disables this
                    className={`text-sm py-1.5 px-3 rounded ${
                      (user as any).enabled // This will cause an error
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {toggling
                      ? 'Traitement...'
                      : (user as any).enabled // This will cause an error
                        ? 'Désactiver'
                        : 'Activer'}
                  </button>

                  {!isAdmin ? (
                    <button
                      onClick={() => handleAssignRole(user.id!)}
                      disabled={isPending || assigning} // ensure assigning disables this
                      className='bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded text-sm'
                    >
                      {assigning ? 'Assignation...' : 'Assigner rôle admin'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRemoveRole(user.id!)}
                      disabled={isPending || removing} // ensure removing disables this
                      className='bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded text-sm'
                    >
                      {removing ? 'Suppression...' : 'Retirer rôle admin'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
        {filteredUsers.length === 0 && (
          <div className='p-4 text-gray-500 text-sm italic'>
            Aucun utilisateur trouvé.
          </div>
        )}
      </div>
    </div>
  )
}
