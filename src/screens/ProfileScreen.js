import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/colors';

const PROFILE_KEY = '@todo_profile';

const DEFAULT_PROFILE = {
  name: 'Seu Nome',
  email: 'seuemail@exemplo.com',
  photo: '',
};

export default function ProfileScreen({ navigation }) {
  const theme = useTheme();
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);

  // Campos temporários usados durante a edição
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState('');
  const [imageError, setImageError] = useState(false);

  // Carrega o perfil salvo
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(PROFILE_KEY);
        if (saved) setProfile(JSON.parse(saved));
      } catch (e) {
        console.log('Erro ao carregar perfil', e);
      }
    })();
  }, []);

  function startEditing() {
    setName(profile.name);
    setEmail(profile.email);
    setPhoto(profile.photo);
    setImageError(false);
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
  }

  async function pickFromGallery() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permissão negada', 'Permita o acesso à galeria para escolher uma foto.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.3,
    base64: true,
  });

  if (!result.canceled) {
    const asset = result.assets[0];
    const uri = asset.base64
      ? `data:image/jpeg;base64,${asset.base64}`
      : asset.uri;
    setPhoto(uri);
    setImageError(false);
  }
}

  async function saveProfile() {
    if (!name.trim()) {
      Alert.alert('Atenção', 'Informe o nome do usuário.');
      return;
    }
    if (!email.trim().includes('@')) {
      Alert.alert('Atenção', 'Informe um e-mail válido.');
      return;
    }

    const updated = { name: name.trim(), email: email.trim(), photo: photo.trim() };
    setProfile(updated);
    setEditing(false);

    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.log('Erro ao salvar perfil', e);
    }
  }

  // Foto exibida: no modo edição mostra a prévia, senão a foto salva
  const currentPhoto = editing ? photo : profile.photo;
  const showPlaceholder = !currentPhoto || imageError;

  const inputStyle = [
    styles.input,
    { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Foto */}
        <View style={styles.photoWrapper}>
          {showPlaceholder ? (
            <View
              style={[
                styles.photo,
                styles.placeholder,
                { borderColor: theme.primary, backgroundColor: theme.card },
              ]}
            >
              <Ionicons name="person" size={64} color={theme.textMuted} />
            </View>
          ) : (
            <Image
              source={{ uri: currentPhoto }}
              style={[styles.photo, { borderColor: theme.primary }]}
              onError={() => setImageError(true)}
            />
          )}
        </View>

        {editing ? (
          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.textMuted }]}>Nome</Text>
            <TextInput
              style={inputStyle}
              value={name}
              onChangeText={setName}
              placeholder="Seu nome"
              placeholderTextColor={theme.textMuted}
            />

            <Text style={[styles.label, { color: theme.textMuted }]}>E-mail</Text>
            <TextInput
              style={inputStyle}
              value={email}
              onChangeText={setEmail}
              placeholder="seuemail@exemplo.com"
              placeholderTextColor={theme.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.label, { color: theme.textMuted }]}>Foto de perfil</Text>
            <TouchableOpacity
              style={[styles.outlineButton, { borderColor: theme.primary }]}
              onPress={pickFromGallery}
              activeOpacity={0.8}
            >
              <Ionicons name="images-outline" size={20} color={theme.primary} />
              <Text style={[styles.outlineButtonText, { color: theme.primary }]}>
                Escolher da galeria
              </Text>
            </TouchableOpacity>

            <Text style={[styles.orText, { color: theme.textMuted }]}>ou cole o link da imagem</Text>
            <TextInput
              style={inputStyle}
              value={photo}
              onChangeText={(t) => {
                setPhoto(t);
                setImageError(false);
              }}
              placeholder="https://exemplo.com/foto.jpg"
              placeholderTextColor={theme.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.button, styles.flex, { backgroundColor: theme.border }]}
                onPress={cancelEditing}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, { color: theme.text }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.flex, { backgroundColor: theme.primary }]}
                onPress={saveProfile}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={[styles.buttonText, { color: '#fff' }]}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.text }]}>{profile.name}</Text>
            <Text style={[styles.email, { color: theme.textMuted }]}>{profile.email}</Text>

            <TouchableOpacity
              style={[styles.outlineButton, { borderColor: theme.primary, marginTop: 24 }]}
              onPress={startEditing}
              activeOpacity={0.8}
            >
              <Ionicons name="create-outline" size={20} color={theme.primary} />
              <Text style={[styles.outlineButtonText, { color: theme.primary }]}>Editar conta</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {!editing && (
        <TouchableOpacity
          style={[styles.button, styles.backButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={[styles.buttonText, { color: '#fff' }]}>Voltar</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  scroll: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  photoWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    marginTop: 6,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    fontSize: 13,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  flex: {
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
  },
  backButton: {
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 20,
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});