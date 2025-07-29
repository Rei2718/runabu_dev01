import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { Alert, AppState, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View style={styles.container}>
      {/* Email Input */}
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
          keyboardType="email-address"
        />
      </View>

      {/* Password Input */}
      <View style={styles.verticallySpaced}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>

      {/* Sign In Button */}
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed || loading ? 0.6 : 1 },
          ]}
          disabled={loading}
          onPress={() => signInWithEmail()}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </Pressable>
      </View>

      {/* Sign Up Button */}
      <View style={styles.verticallySpaced}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed || loading ? 0.6 : 1 },
          ]}
          disabled={loading}
          onPress={() => signUpWithEmail()}
        >
          <Text style={styles.buttonText}>Sign up</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  label: {
    color: '#333',
    marginBottom: 4,
    fontSize: 16,
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})