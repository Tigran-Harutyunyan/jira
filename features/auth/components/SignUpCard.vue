<script setup lang="ts">
import { useForm, configure } from "vee-validate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { registerSchema } from "@/features/auth/schemas";

const showTerms = false;

const queryClient = useQueryClient();
const router = useRouter();
const { toast, showResponseError } = useToastMessage();

configure({
  validateOnBlur: false,
});

const form = useForm({
  initialValues: {
    name: "",
    email: "",
    password: "",
  },
  validationSchema: registerSchema,
});

const { mutate: register, isPending } = useMutation({
  mutationFn: (payload) =>
    $fetch(`/api/auth/register`, {
      method: "POST",
      body: payload,
    }),
  onSuccess: (data) => {
    if (data?.success) {
      queryClient.invalidateQueries({ queryKey: ["current"] });
      toast({
        title: "Registered. Please sign in",
      });
      router.push("/sign-in");
    }
  },
  onError: (error) => {
    showResponseError(error);
  },
});

const onSubmit = form.handleSubmit(async (values) => {
  if (!(values.name && values.email && values.password)) return;

  const payload = {
    name: values.name,
    email: values.email,
    password: values.password,
  };
  register(payload);
});
</script>

<template>
  <Card class="w-full h-full md:w-[487px] border-none shadow-none">
    <CardHeader class="flex items-center justify-center text-center p-7">
      <CardTitle class="text-2xl"> Sign Up</CardTitle>
      <CardDescription v-if="showTerms">
        By signing up, you agree to our
        <NuxtLink to="/privacy">
          <span class="text-blue-700">Privacy Policy</span>
        </NuxtLink>
        and
        <NuxtLink to="/terms">
          <span class="text-blue-700">Terms of Service</span>
        </NuxtLink>
      </CardDescription>
    </CardHeader>
    <div class="px-7">
      <DottedSeparator />
    </div>
    <CardContent class="p-7">
      <form @submit.prevent.stop="onSubmit" class="space-y-8 w-full">
        <FormField name="name" v-slot="{ componentField }">
          <FormItem>
            <FormControl>
              <Input
                v-bind="componentField"
                type="text"
                placeholder="Enter email name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="email" v-slot="{ componentField }">
          <FormItem>
            <FormControl>
              <Input
                v-bind="componentField"
                type="email"
                placeholder="Enter email address"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="password" v-slot="{ componentField }">
          <FormItem>
            <FormControl>
              <Input
                v-bind="componentField"
                type="password"
                placeholder="Enter password"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
        <Button :disabled="isPending" size="lg" class="w-full">
          {{ isPending ? "Wait..." : "Sign Up" }}
        </Button>
      </form>
    </CardContent>
    <div class="px-7">
      <DottedSeparator />
    </div>

    <div class="px-7">
      <DottedSeparator />
    </div>
    <CardContent class="p-7 flex items-center justify-center">
      <p>
        Already have an account?
        <NuxtLink to="/sign-in">
          <span class="text-blue-700">&nbsp;Sign In</span>
        </NuxtLink>
      </p>
    </CardContent>
  </Card>
</template>
