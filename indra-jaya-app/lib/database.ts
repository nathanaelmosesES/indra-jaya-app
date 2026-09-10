import { supabase } from './supabase'

/**
 * Generic CRUD helpers over Supabase (PostgREST) tables.
 *
 * `table` is the name of your table. `T` is the row shape.
 * Every helper throws on error so callers can use try/catch.
 */

// --- Read -------------------------------------------------------------------

/** Fetch all rows from a table (optionally ordered). */
export async function getAll<T>(
  table: string,
  options?: { orderBy?: string; ascending?: boolean },
): Promise<T[]> {
  let query = supabase.from(table).select('*')
  if (options?.orderBy) {
    query = query.order(options.orderBy, { ascending: options.ascending ?? true })
  }
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as T[]
}

/** Fetch a single row by id. */
export async function getById<T>(
  table: string,
  id: string | number,
  idColumn = 'id',
): Promise<T | null> {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq(idColumn, id)
    .maybeSingle()
  if (error) throw error
  return data as T | null
}

/** Fetch rows matching an equality filter, e.g. { user_id: '123' }. */
export async function getWhere<T>(
  table: string,
  filters: Record<string, unknown>,
): Promise<T[]> {
  const { data, error } = await supabase.from(table).select('*').match(filters)
  if (error) throw error
  return (data ?? []) as T[]
}

// --- Create -----------------------------------------------------------------

/** Insert one row and return the created record. */
export async function create<T>(table: string, values: Partial<T>): Promise<T> {
  const { data, error } = await supabase
    .from(table)
    .insert(values as never)
    .select()
    .single()
  if (error) throw error
  return data as T
}

/** Insert many rows and return the created records. */
export async function createMany<T>(table: string, values: Partial<T>[]): Promise<T[]> {
  const { data, error } = await supabase
    .from(table)
    .insert(values as never)
    .select()
  if (error) throw error
  return (data ?? []) as T[]
}

// --- Update -----------------------------------------------------------------

/** Update a row by id and return the updated record. */
export async function update<T>(
  table: string,
  id: string | number,
  values: Partial<T>,
  idColumn = 'id',
): Promise<T> {
  const { data, error } = await supabase
    .from(table)
    .update(values as never)
    .eq(idColumn, id)
    .select()
    .single()
  if (error) throw error
  return data as T
}

// --- Delete -----------------------------------------------------------------

/** Delete a row by id. */
export async function remove(
  table: string,
  id: string | number,
  idColumn = 'id',
): Promise<void> {
  const { error } = await supabase.from(table).delete().eq(idColumn, id)
  if (error) throw error
}
