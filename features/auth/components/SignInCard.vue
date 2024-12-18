<script setup lang="ts">
import { useForm, configure } from "vee-validate";
import { useToast } from "@/components/ui/toast/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { loginSchema } from "@/features/auth/schemas";

configure({
  validateOnBlur: false,
});

const queryClient = useQueryClient();
const router = useRouter();
const { toast } = useToast();

const form = useForm({
  initialValues: {
    email: "",
    password: "",
  },
  validationSchema: loginSchema,
});

const { mutate: login, isPending } = useMutation({
  mutationFn: (payload) =>
    $fetch(`/api/auth/login`, {
      method: "POST",
      body: payload,
    }),
  onSuccess: ({ isLoggedIn }) => {
    if (isLoggedIn) {
      queryClient.invalidateQueries({ queryKey: ["current"] });
      toast({
        title: "Logged in",
      });

      location.href = "/workspaces";
    }
  },
  onError: (error) => {
    toast({
      title: error?.message,
    });
  },
});

const onSubmit = form.handleSubmit(async (values) => {
  if (!(values.email && values.password)) return;

  const payload = {
    email: values.email,
    password: values.password,
  };

  login(payload);
});
</script>

<template>
  <Card class="w-full h-full md:w-[487px] border-none shadow-none">
    <CardHeader class="flex items-center justify-center text-center p-7">
      <CardTitle class="text-2xl"> Welcome back! </CardTitle>
    </CardHeader>
    <div class="px-7">
      <DottedSeparator />
    </div>
    <CardContent class="p-7">
      <form @submit.prevent.stop="onSubmit" class="space-y-8 w-full">
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
          {{ isPending ? "Wait..." : "Sign in" }}
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
        Don&apos;t have an account?
        <NuxtLink to="/sign-up">
          <span class="text-blue-700">&nbsp;Sign Up</span>
        </NuxtLink>
      </p>
    </CardContent>
  </Card>
</template>
