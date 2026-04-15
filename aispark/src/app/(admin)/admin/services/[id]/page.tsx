"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { serviceSchema, type ServiceFormValues } from "@/lib/validations/service"
import { useService, useCreateService, useUpdateService, useCategories } from "@/lib/api/use-services"

export default function AdminServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const isNew = id === "new"
  const router = useRouter()

  const { data: service, isLoading: loadingService } = useService(isNew ? "" : id)
  const { data: categories = [], isLoading: loadingCats } = useCategories()
  const createService = useCreateService()
  const updateService = useUpdateService(id)

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    values: isNew ? { name: "", description: "", categoryId: "", price: 0, duration: 60 } : {
      name: service?.name ?? "",
      description: service?.description ?? "",
      categoryId: service?.categoryId ?? "",
      price: Number(service?.price ?? 0),
      duration: service?.duration ?? 60,
      imageUrl: service?.imageUrl ?? "",
    },
  })

  const onSubmit = (data: ServiceFormValues) => {
    if (isNew) {
      createService.mutate(data, { onSuccess: () => router.push("/admin/services") })
    } else {
      updateService.mutate(data, { onSuccess: () => router.push("/admin/services") })
    }
  }

  if (!isNew && loadingService) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const isPending = createService.isPending || updateService.isPending

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="-ml-2">
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to Services
      </Button>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">{isNew ? "Add Service" : "Edit Service"}</h1>
        <p className="text-muted-foreground">{isNew ? "Create a new service listing" : "Update service details and pricing"}</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Name</FormLabel>
                    <FormControl><Input placeholder="e.g. Deep Home Cleaning" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea placeholder="Describe the service..." rows={4} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={loadingCats}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={loadingCats ? "Loading…" : "Select a category"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={0.01} {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={15} {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (optional)</FormLabel>
                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isNew ? "Create Service" : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
