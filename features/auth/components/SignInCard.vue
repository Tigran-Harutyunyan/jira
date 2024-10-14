<script setup lang="ts">
import { z } from "zod";
import { useForm } from "vee-validate";

import { FcGoogle } from "vue3-icons/fc";
import { FaGithub } from "vue3-icons/fa";
import DottedSeparator from "@/components/DottedSeparator.vue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { loginSchema } from "../schemas";

import { useUserSession } from "@/features/auth/composables/useUserSession";

const { login, isPending } = useUserSession();
// import { signUpWithGithub, signUpWithGoogle } from "@/lib/oauth";

const form = useForm({
  initialValues: {
    email: "",
    password: "",
  },
  validationSchema: loginSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  if (!(values.email && values.password)) return;

  try {
    await login(values.email, values.password);
  } catch (error) {}
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
        <Button :disabled="isPending" size="lg" class="w-full"> Login </Button>
      </form>
    </CardContent>
    <div class="px-7">
      <DottedSeparator />
    </div>
    <CardContent class="p-7 flex flex-col gap-y-4">
      <!-- <Button
        @click="signUpWithGoogle()"
        :disabled="isPending"
        variant="secondary"
        size="lg"
        class="w-full"
      >
        <FcGoogle class="mr-2 size-5" />
        Login with Google
      </Button>
      <Button
        @click="signUpWithGithub()"
        :disabled="isPending"
        variant="secondary"
        size="lg"
        class="w-full"
      >
        <FaGithub class="mr-2 size-5" />
        Login with Github
      </Button> -->
    </CardContent>
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
