INSERT INTO public."Functionality" (id, active, created_at, updated_at, deleted_at, name, description, path, "functionalityTypeId", "masterId", "icon") VALUES 

('8c29a940-463c-4670-914a-ef57cfb8cb3e', true, '2022-08-27 00:00:00.00', NULL, NULL, 'Início', 'Página inicial', '', '52a19d20-9904-4a2d-b7c5-ff3d25b80e41', NULL, 'home'),
('4356f7c3-a892-4183-8c8a-948a35449576', true, '2022-08-27 00:00:00.00', NULL, NULL, 'Controle de Acesso', 'Menu de controle de acesso', null, '52a19d20-9904-4a2d-b7c5-ff3d25b80e41', NULL, 'Settings'),


('717109da-28f6-4c11-902d-987c15c1da31', true, '2022-08-27 00:00:00.00', NULL, NULL, 'Cliente', 'Tela de clientes', '/client', '52a19d20-9904-4a2d-b7c5-ff3d25b80e41', '4356f7c3-a892-4183-8c8a-948a35449576', 'person'),
('8179127f-df6f-4b7c-abc3-700847929453', true, '2022-08-27 00:00:00.00', NULL, NULL, 'Detalhes do Cliente', 'Tela de Detalhes do Cliente', '/client/detail/:id', '60d398d2-7f37-4728-8ebe-8d23871bbe31', '4356f7c3-a892-4183-8c8a-948a35449576', null),

('df4abcaa-219b-4ea9-ad1d-27833d25c575', true, '2022-08-27 00:00:00.00', NULL, NULL, 'Tipo de Funcionalidade', 'Tela de tipos de funcionalidade', '/functionality_type', '52a19d20-9904-4a2d-b7c5-ff3d25b80e41', '4356f7c3-a892-4183-8c8a-948a35449576', 'star'),
('4c610b20-8502-48c8-ab08-56bc8769cfe5', true, '2022-08-27 00:00:00.00', NULL, NULL, 'Detalhes do Tipo da Funcionalidade', 'Tela de detalhes do tipo de funcionalidade', '/functionality_type/detail/:id', '60d398d2-7f37-4728-8ebe-8d23871bbe31', '4356f7c3-a892-4183-8c8a-948a35449576', null),

('cde58893-7711-4360-aace-29af0427090e', true, '2022-08-27 00:00:00.00', NULL, NULL, 'Funcionalidade', 'Tela de funcionalidades', '/functionality', '52a19d20-9904-4a2d-b7c5-ff3d25b80e41', '4356f7c3-a892-4183-8c8a-948a35449576', 'auto_awesome'),
('39690eba-373c-4197-b06b-a3ca9262a353', true, '2022-08-27 00:00:00.00', NULL, NULL, 'Detalhes da Funcionalidade', 'Tela de detalhes da funcionalidade', '/functionality/detail/:id', '60d398d2-7f37-4728-8ebe-8d23871bbe31', '4356f7c3-a892-4183-8c8a-948a35449576', null),

('72ba5227-be0c-4790-8a3c-bc4a7533a3bd', true, '2022-08-27 00:00:00.00', NULL, NULL, 'Perfil', 'Tela de perfis', '/profile', '52a19d20-9904-4a2d-b7c5-ff3d25b80e41', '4356f7c3-a892-4183-8c8a-948a35449576', 'group'),
('58ff9be5-8f28-4e72-a06c-7966ed99fb90', true, '2022-08-27 00:00:00.00', NULL, NULL, 'Detalhes do Perfil', 'Tela de detalhes do perfil', '/profile/detail/:id', '60d398d2-7f37-4728-8ebe-8d23871bbe31', '4356f7c3-a892-4183-8c8a-948a35449576', null),

('1b89ccfc-b0ff-4772-9433-0d214a66997c', true, '2022-08-27 00:00:00.00', NULL, NULL, 'Usuário', 'Tela de usuários ', '/user', '52a19d20-9904-4a2d-b7c5-ff3d25b80e41', '4356f7c3-a892-4183-8c8a-948a35449576', 'person'),
('212bba93-eb66-43ee-be0d-cbc00fdfce78', true, '2022-08-27 00:00:00.00', NULL, NULL, 'Detalhes do Usuário', 'Tela de detalhes do usuário', '/user/detail/:id', '60d398d2-7f37-4728-8ebe-8d23871bbe31', '4356f7c3-a892-4183-8c8a-948a35449576', null);
