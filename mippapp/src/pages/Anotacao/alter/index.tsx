/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useRef, useState, useEffect} from 'react';
import {KeyboardAvoidingView, ScrollView, Platform} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';
import Icon from 'react-native-vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-community/picker';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

import api from '../../../services/api';

import {
  Container,
  Header,
  BackButton,
  HeaderText,
  RowTitle,
  Calendar,
  CalendarText,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  PickerContainer,
  PickerContainerText,
  Row,
  Col,
  ColText,
} from './styles';

interface Praga {
  id: string;
  mediaEncontrada: string;
  nome: string;
  tamanho: string;
}
interface Doenca {
  id: string;
  mediaEncontrada: string;
  nome: string;
}
interface Inimigos {
  id: string;
  mediaEncontrada: string;
  nome: string;
}
interface Anotacao {
  id: string;
  dataDaColeta: Date;
  estadioDaCultura: string;
  desfolha: 'string';
  pragas: Praga[];
  doencas: Doenca[];
  inimigos: Inimigos[];
  responsavelLancamento: string;
  ultimaAlteracao: Date;
}

interface RouteParams {
  index: Number;
}

const AlterAnotacoes: React.FC = () => {
  const [anotacao, setAnotacao] = useState<Anotacao>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dataDaColeta, setSelectedDate] = useState(new Date());
  const [estadioDaCultura, setEstadioDaCultura] = useState('V4');
  const formRef = useRef<FormHandles>(null);
  const route = useRoute();
  const routeParams = route.params as RouteParams;
  const navigation = useNavigation();
  const index = routeParams.index;

  const doencas = [
    {
      id: 1,
      nome: 'Lagartas com Nomuraea (Doença Branca)',
      responsavelLancamento: 'João Silva',
      ultimaAlteracao: new Date(),
    },
    {
      id: 2,
      nome: 'Lagartas com Boculovírus (Doença Preta)',
      responsavelLancamento: 'João Silva',
      ultimaAlteracao: new Date(),
    },
  ];

  const inimigos = [
    {
      id: 3,
      nome: 'Calosoma Granulatum',
      responsavelLancamento: 'João Silva',
      ultimaAlteracao: new Date(),
    },
    {
      id: 4,
      nome: 'Callida Sp.',
      responsavelLancamento: 'João Silva',
      ultimaAlteracao: new Date(),
    },
  ];
  const pragas = [
    {
      id: 5,
      nome: 'Lagarta Da Soja',
      nomeCientifico: 'Anticarsia sp.',
      tamanho: '>=1,5cm',
      responsavelLancamento: 'João Silva',
      ultimaAlteracao: new Date(),
    },
    {
      id: 6,
      nome: 'Lagarta Da Soja',
      nomeCientifico: 'Anticarsia sp.',
      tamanho: '< 1,5cm',
      responsavelLancamento: 'João Silva',
      ultimaAlteracao: new Date(),
    },
    {
      id: 7,
      nome: 'Lagartas com Nomuraea',
      nomeCientifico: 'Doença Branca',
      tamanho: '>=1,5cm',
      responsavelLancamento: 'João Silva',
      ultimaAlteracao: new Date(),
    },
  ];

  useEffect(() => {
    api.get(`/anotacoes/${index}`).then((response) => {
      setAnotacao(response.data);
      setSelectedDate(new Date(response.data.dataDaColeta));
      setEstadioDaCultura(response.data.estadioDaCultura);
    });
  }, []);

  const handleSignIn = useCallback(
    async (data: Anotacao) => {
      await data.pragas.forEach(function (item, index) {
        item.id = index.toString();
        item.nome = pragas[index].nome;
        item.tamanho = pragas[index].tamanho;
      });

      await data.doencas.forEach(function (item, index) {
        item.id = index.toString();
        item.nome = doencas[index].nome;
      });

      await data.inimigos.forEach(function (item, index) {
        item.id = index.toString();
        item.nome = inimigos[index].nome;
      });

      data = {
        ...data,
      };
      await api.put(`/anotacoes/${index}`, {
        ...data,
        dataDaColeta,
        estadioDaCultura,
      });
      navigation.navigate('IndexAnotacao', data);
    },
    [navigation, dataDaColeta, estadioDaCultura],
  );

  const cancel = function () {
    navigation.goBack();
  };

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((show) => !show);
  }, []);

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }

      if (date) {
        setSelectedDate(date);
      }
    },
    [],
  );

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled>
      <Header>
        <BackButton onPress={() => navigation.navigate('IndexAnotacao')}>
          <Icon name="arrow-left" size={24} color="#ff4961" />
        </BackButton>
        <HeaderText>Anotação de Campo</HeaderText>
      </Header>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Container>
          <Form
            initialData={{...anotacao}}
            ref={formRef}
            onSubmit={handleSignIn}
            style={{width: '100%'}}>
            <RowTitle>Dados de Amostragem</RowTitle>
            <Calendar>
              <CalendarText>Escolha a data</CalendarText>
              <OpenDatePickerButton onPress={handleToggleDatePicker}>
                <OpenDatePickerButtonText>
                  {new Date(dataDaColeta).getDate()}/
                  {new Date(dataDaColeta).getMonth() + 1}/
                  {new Date(dataDaColeta).getFullYear()}
                </OpenDatePickerButtonText>
              </OpenDatePickerButton>
              {showDatePicker && (
                <DateTimePicker
                  mode="date"
                  display="calendar"
                  onChange={handleDateChanged}
                  value={dataDaColeta}
                />
              )}
            </Calendar>
            <PickerContainer>
              <PickerContainerText>Estádio da Cultura:</PickerContainerText>
              <Picker
                selectedValue={estadioDaCultura}
                style={{height: 50, width: 100}}
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onValueChange={(itemValue, itemIndex) =>
                  setEstadioDaCultura(itemValue.toString())
                }>
                <Picker.Item label="Pré-emergência" value="Pré-emergência" />
                <Picker.Item label="VE" value="VE" />
                <Picker.Item label="VC" value="VC" />
                <Picker.Item label="V1" value="V1" />
                <Picker.Item label="V3" value="V3" />
                <Picker.Item label="V4" value="V4" />
                <Picker.Item label="V5" value="V5" />
                <Picker.Item label="V6" value="V6" />
                <Picker.Item label="V7" value="V7" />
                <Picker.Item label="V8" value="V8" />
                <Picker.Item label="V9" value="V9" />
              </Picker>
            </PickerContainer>

            <Input name="desfolha" keyboardType="numeric" placeholder="0">
              % de Desfolha (em números inteiros)
            </Input>
            <RowTitle>Informar Dados Flutuação das Pragas</RowTitle>
            <Row>
              <Col>
                <ColText>Insetos Praga</ColText>
              </Col>
              <Col>
                <ColText>Tamanho</ColText>
              </Col>
              <Col>
                <ColText>Média Encontrada</ColText>
              </Col>
            </Row>
            {anotacao?.pragas.map((praga, index) => (
              <Row key={`praga[${index}].id`}>
                <Col>
                  <ColText>{praga.nome}</ColText>
                </Col>
                <Col>
                  <ColText>{praga.tamanho}</ColText>
                </Col>
                <Col>
                  <Input
                    name={`pragas[${index}].mediaEncontrada`}
                    keyboardType="numeric"
                    returnKeyType="next"
                  />
                </Col>
              </Row>
            ))}

            <RowTitle>Informar Dados Doenças das Pragas</RowTitle>
            <Row>
              <Col>
                <ColText>Doença Praga</ColText>
              </Col>
              <Col>
                <ColText>Média Encontrada</ColText>
              </Col>
            </Row>
            {anotacao?.doencas.map((doenca, index) => (
              <Row key={`doenca[${index}].id`}>
                <Col>
                  <ColText>{doenca.nome}</ColText>
                </Col>
                <Col>
                  <Input
                    name={`doencas[${index}].mediaEncontrada`}
                    keyboardType="numeric"
                    returnKeyType="next"
                  />
                </Col>
              </Row>
            ))}
            <RowTitle>Informar Dados de Inimigos Naturais</RowTitle>
            <Row>
              <Col>
                <ColText>Inimigos Naturais</ColText>
              </Col>
              <Col>
                <ColText>Média Encontrada</ColText>
              </Col>
            </Row>
            {anotacao?.inimigos.map((inimigo, index) => (
              <Row key={`inimigo[${index}].id`}>
                <Col>
                  <ColText>{inimigo.nome}</ColText>
                </Col>
                <Col>
                  <Input
                    name={`inimigos[${index}].mediaEncontrada`}
                    keyboardType="numeric"
                    returnKeyType="next"
                  />
                </Col>
              </Row>
            ))}

            <Button
              style={{backgroundColor: '#428cff'}}
              onPress={() => {
                formRef.current?.submitForm();
                formRef.current?.setFieldValue('nomeCientifico', '');
                formRef.current?.setFieldValue('nome', '');
              }}>
              SALVAR
            </Button>

            <Button
              style={{backgroundColor: '#ff4961'}}
              onPress={() => {
                formRef.current?.setFieldValue('nomeCientifico', '');
                formRef.current?.setFieldValue('nome', '');

                cancel();
              }}>
              CANCELAR
            </Button>
          </Form>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AlterAnotacoes;
