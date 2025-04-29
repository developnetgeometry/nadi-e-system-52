import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider"
import { useAuth } from './hooks/useAuth';
import { Auth } from '@supabase/auth-ui-react'
import {
  //Auth,
  SignIn,
  SignUp,
  // MagicLink,
  ForgotPassword,
  UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  ForgotPassword as ForgotPasswordPage,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  UpdatePassword as UpdatePasswordPage,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  SignIn as SignInPage,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  SignUp as SignUpPage,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
  //SignUp,
  //MagicLink,
  //ForgotPassword,
  //UpdatePassword,
} from '@supabase/auth-ui-react'
import {
  //Auth,
  //SignIn,
